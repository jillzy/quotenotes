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
            if (data.email) {
                self.vue.the_email = data.email;
            }
            enumerate(self.vue.posts);
        })
    };

    self.get_more = function () {
        var num_posts = self.vue.posts.length;
        $.getJSON(get_posts_url(num_posts, num_posts + 4), function (data) {
            self.vue.has_more = data.has_more;
            self.extend(self.vue.posts, data.posts);
            enumerate(self.vue.posts);
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
                post_content: self.vue.form_post_content
//                user_email: self.vue.form_user_email,
//                user_name: self.vue.form_user_name,
//                created_on: self.vue.form_created_on,
//                updated_on: self.vue.form_updated_on
            },
            function (data) {
                $.web2py.enableElement($("#add_post_submit"));
                self.vue.posts.unshift(data.post);
                enumerate(self.vue.posts);
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
                         if (self.vue.the_email == self.vue.posts[i].user_email)
                            // If I set this to i, it won't work, as the if below will
                            // return false for items in first position.
                            idx = i + 1;
                            break;
                    }
                }
                if (idx) {
                    self.vue.posts.splice(idx - 1, 1);
                }
                enumerate(self.vue.posts);

                self.vue.showPost = true;
                self.vue.showInfo = false;
                self.vue.showTags = false;
                self.vue.showDel = false;
            }
        )
    };

    self.edit_post_button = function (post_id, content, _idx, poster_email) {
        // The button to add a post has been pressed.
        if (self.vue.the_email == poster_email) {
            self.vue.show_post = false;
        } else {
            self.vue.show_post = true;
        }
        self.vue.the_post_idx = _idx;
        self.vue.the_post = self.vue.posts[self.vue.the_idx];
        self.vue.original_content = content;
        self.vue.form_edit_content = self.vue.original_content;
        self.vue.the_id = post_id;
        console.log(self.vue.original_content);

    };


    function get_edit_url (_idx) {
        var pp = {
            start_idx: _idx,
            end_idx: _idx
        };
        return edit_post_url + "?" + $.param(pp);
    }




    self.handle_form_stuff = function () {
        self.vue.show_post = true;
        console.log("handle form");
        $.post(edit_post_url/* + "?" + $.param(_idx=self.vue.the_post_idx),*/,
            {
                post_id: self.vue.the_id,
                _idx: self.vue.the_post_idx,
                post_content: self.vue.form_edit_content
            }
        );
        self.vue.posts[self.vue.the_post_idx].post_content = self.vue.form_edit_content;
        console.log(self.vue.posts[self.vue.the_post_idx].post_content);
        self.vue.showPost = true;
        self.vue.showInfo = false;
        self.vue.showTags = false;
        self.vue.showEdit = false;
        self.vue.showDel = false;
    };


    self.hide = function() {
        self.vue.show = false;
    }

    self.debug = function() {
        console.log("debug");
    }

    self.postTab = function() {
        console.log("post tab");
        self.vue.showPost = true;
        self.vue.showInfo = false;
        self.vue.showTags = false;
        self.vue.showEdit = false;
        self.vue.showDel = false;

    }

    self.infoTab = function() {
        //$("#entry").style.color = 'red';
        console.log("info tab");
        activeColour = 'red';
        self.vue.showPost = false;
        self.vue.showInfo = true;
        self.vue.showTags = false;
        self.vue.showEdit = false;
        self.vue.showDel = false;
    }


    self.tagsTab = function() {
        console.log("tags tab");
        self.vue.showPost = false;
        self.vue.showInfo = false;
        self.vue.showTags = true;
        self.vue.showEdit = false;
        self.vue.showDel = false;

    }

    self.editTab = function() {
        console.log("edit");
        self.vue.showPost = false;
        self.vue.showInfo = false;
        self.vue.showTags = false;
        self.vue.showEdit = true;
        self.vue.showDel = false;
    }


    self.delTab = function() {
        console.log("delete");
        self.vue.showPost = false;
        self.vue.showInfo = false;
        self.vue.showTags = false;
        self.vue.showEdit = false;
        self.vue.showDel = true;
    }

    self.closeAddPost = function() {
        self.vue.is_adding_post = false;
    }


    self.toggleEditInfo = function() {
        self.vue.isEditingInfo= !self.vue.isEditingInfo;
    }



    self.activate = function(id) {
        console.log("activate");
        if (self.vue.the_id) {
            self.vue.prev_id = self.vue.the_id;
        }
        self.vue.the_id = id;
        if (self.vue.the_id != self.vue.prev_id) {
            self.vue.showPost = false;
            self.vue.showInfo = false;
            self.vue.showTags = false;
            self.vue.showEdit = false;
            self.vue.showDel = false;
        }
        console.log(self.vue.the_id);
        self.vue.flag = true;
        self.vue.activated = true;
        self.vue.showPost = true;
    }


    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        //el: ["#vue-div", "entry"],
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            has_more: false,
            is_adding_post: false,
            posts: [],
            logged_in: false,
            form_post_content: null,
            form_user_email: null,
            form_created_on: null,
            form_updated_on: null,
            form_user_name: null,
            form_edit_content: null,
            the_id: null,
            the_post: null,
            the_post_idx: null,
            show_post: true,
            original_content: null,
            is_user: false,
            the_email: "None",
            can_edit: false,
            show: true,
            activeColour: 'white',
            showPost: true,
            showInfo: false,
            showTags: false,
            showEdit: false,
            showDel: false,
            activated: false,
            prev_id: null,
            flag: false,
            isEditingInfo: false

        },

        methods: {
            get_more: self.get_more,
            not_adding: self.not_adding,
            //get_edit_url: self.get_edit_url,
            clear_post_form: self.clear_post_form,
            add_post_button: self.add_post_button,
            edit_post_button: self.edit_post_button,
            handle_form_stuff: self.handle_form_stuff,
            get_posts: self.get_posts,
            add_post: self.add_post,
            del_post: self.delete_post,
            handle_form_stuff2: self.handle_form_stuff2,
            hide: self.hide,
            debug: self.debug,
            postTab: self.postTab,
            infoTab: self.infoTab,
            tagsTab: self.tagsTab,
            editTab: self.editTab,
            delTab: self.delTab,
            closeAddPost: self.closeAddPost,
            activate: self.activate,
            toggleEditInfo: self.toggleEditInfo
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