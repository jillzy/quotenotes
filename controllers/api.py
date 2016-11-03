# These are the controllers for your ajax api.
def get_posts():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    # We just generate a lot of of data.
    posts = []
    has_more = False
    rows = db().select(db.post.ALL, limitby=(start_idx, end_idx + 1))
    for i, r in enumerate(rows):
        if i < end_idx - start_idx:
            p = dict(
                id=r.id,
                post_content=r.post_content,
                user_email=r.user_email,
                created_on=r.created_on,
                updated_on=r.updated_on,
            )
            posts.append(p)
        else:
            has_more = True
    logged_in = get_user_email() is not None
    return response.json(dict(
        posts=posts,
        logged_in=logged_in,
        has_more=has_more,
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_post():
    t_id = db.post.insert(
        post_content=request.vars.post_content,
        user_email=request.vars.user_email,
        created_on=request.vars.created_on,
        updated_on=request.vars.updated_on,
    )
    t = db.post(t_id)
    return response.json(dict(post=t))


@auth.requires_signature()
def del_post():
    db(db.post.id == request.vars.post_id).delete()
    return "ok"

