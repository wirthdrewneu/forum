import React, { useState, useEffect } from "react";
import "./thread.css";
import { withRouter, Redirect } from "react-router-dom";
import { getThread } from "../../api/thread";
import Loader from "react-loader-spinner";
import PostList from "../../components/post-list";
import NewPost from "../../components/new-post";

const ThreadPage = (props) => {
  // declare states
  const [id, setId] = useState(undefined);
  const [redirectToHome, setRedirectToHome] = useState(false);
  const [threadLoaded, setThreadLoaded] = useState(false);
  const [thread, setThread] = useState({});
  const [posts, setPosts] = useState({});

  // Get thread here

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.threadId
    ) {
      setId(props.location.state.threadId);
    } else if (props.match && props.match.params && props.match.params.thread) {
      setId(props.match.params.thread);
    } else {
      setRedirectToHome(true);
    }
  }, []);

  useEffect(() => {
    console.log("Id updated", id);

    const getPosts = () => {
      getThread(id)
        .then((response) => {
          if (response.status === 200) {
            console.log("Get thread success");
            // link to thread page
            console.log("thread", response.data);
            if (
              response.data &&
              response.data.length &&
              response.data.length > 0
            ) {
              setThread(response.data[0]);
              setPosts(response.data[0].posts);
              setThreadLoaded(true);
            }
          } else if (response.status === 202) {
            console.error("error", response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (id) {
      getPosts();
    }
  }, [id]);

  const addPostToList = (post) => {
    setPosts(() => [...posts, post]);
  };

  if (redirectToHome === true) {
    return <Redirect to="/" />;
  }

  return (
    <div className="thread">
      <h1>thread page here: id: {id}</h1>

      {
        // Show loader until we load the user list
        threadLoaded ? (
          // posts here
          <div>
            <ul>
              <li>subject: {thread.subject}</li>
              <li>created: {thread.created}</li>
              <li>active: {thread.active}</li>
              <li>user: {JSON.stringify(thread.user)}</li>
              <li>id: {thread.id}</li>
            </ul>
            <br />
            <PostList posts={posts} />
            <br />
            <NewPost success={addPostToList} threadId={thread.id} />
          </div>
        ) : (
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            className="loader"
          />
        )
      }
    </div>
  );
};

export default withRouter(ThreadPage);
