// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    function get_posts_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }

    self.get_posts = function () {
        $.getJSON(get_posts_url(0, 4), function (data) {
            self.vue.posts = data.posts;
            self.vue.has_more = data.has_more;
            self.vue.logged_in = data.logged_in;
        })
    };

    self.get_more = function () {
        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
        });
    };

    self.add_post_button = function () {
        if (self.vue.logged_in){
        // The button to add a post has been pressed.
            self.vue.is_adding_post = !self.vue.is_adding_post;
            self.vue.form_post_content = "";
        }
    };

    self.clear_post_form = function () {
    };


    self.add_post = function () {
        // The submit button to add a post has been added.
        $.post(add_post_url,
            {
                post_content: self.vue.form_post_content,
                user_email: self.vue.form_user_email,
                user_name: self.vue.form_user_name,
                created_on: self.vue.form_created_on,
                updated_on: self.vue.form_updated_on
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                self.vue.form_post_content = "";
            });
    };

    self.delete_post = function(post_id) {
        $.post(del_post_url,
            {
                post_id: post_id
            },
            function () {
                var idx = null;
                for (var i = 0; i < self.vue.posts.length; i++) {
                    if (self.vue.posts[i].id === post_id) {
                        // If I set this to i, it won't work, as the if below will
                        // return false for items in first position.
                        idx = i + 1;
                        break;
                    }
                }
                if (idx) {
                    self.vue.posts.splice(idx - 1, 1);
                }
            }
        )
    };

    self.edit_post_button = function (post_id, content, post_idx) {
        // The button to add a post has been pressed.
        self.vue.the_post_idx = post_idx;
        self.vue.the_post = self.vue.posts[self.vue.the_idx];
        self.vue.is_editing_post = !self.vue.is_editing_post;
        self.vue.original_content = content;
        self.vue.form_edit_content = self.vue.original_content;
        console.log(self.vue.original_content);
        console.log(self.vue.is_editing_post);
        console.log(post_id);
        self.vue.the_id = post_id;
        self.vue.show_post = false;

    };


    self.handle_form_stuff = function () {
        self.vue.is_editing_post = !self.vue.is_editing_post;
        self.vue.show_post = true;
        console.log("handle form");
        $.post(edit_post_url,
            {
                post_id: self.vue.the_id,
                post_content: self.vue.form_edit_content
            }
        );
        self.get_posts();
        $("#vue-div").show();
    };

    self.handle_form_stuff2 = function () {
        self.vue.is_editing_post = !self.vue.is_editing_post;
    }


    function get_edit_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return posts_url + "?" + $.param(pp);
    }


    self.edit_post = function(post_id) {
        console.log("edit post");
        console.log(post_id)
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            is_adding_post: false,
            is_editing_post: false,
            posts: [],
            logged_in: false,
            form_post_content: null,
            form_user_email: null,
            form_created_on: null,
            form_updated_on: null,
            form_user_name: null,
            form_edit_content:null,
            the_id: null,
            the_post: null,
            the_post_idx: null,
            show_post:true,
            original_content: null

        },
        methods: {
            get_more: self.get_more,
            get_edit_url: self.get_edit_url,
            clear_post_form: self.clear_post_form,
            add_post_button: self.add_post_button,
            edit_post_button: self.edit_post_button,
            handle_form_stuff: self.handle_form_stuff,
            get_posts: self.get_posts,
            add_post: self.add_post,
            del_post: self.delete_post,
            edit_post: self.edit_post,
            handle_form_stuff2: self.handle_form_stuff2
        }

    });

    self.get_posts();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});