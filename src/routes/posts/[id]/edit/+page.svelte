<script>
  import Main from "../../../../components/main.svelte";
  import { userStore } from "../../../../stores";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { afterNavigate } from "$app/navigation";

  let title;
  let body;
  let error;
  let formLoading = false;

  let postId;

  let postCreatorId;
  let user;
  userStore.subscribe((value) => (user = value));

  onMount(async () => {
    const pageResponse = await axios.get(
      `http://localhost:8080/posts/${$page.params.id}`
    );

    postId = pageResponse.data.post.id;
    title = pageResponse.data.post.title;
    body = pageResponse.data.post.body;

    postCreatorId = pageResponse.data.user.id;
    // if (user?.id != postCreatorId) {
    //   goto("/");
    // }
  });

  const editPost = async () => {
    if (!title.length || !body.length) {
      error = "Fields can't be empty";
    } else {
      error = "";
      formLoading = true;
      const token = localStorage.getItem("token");
      await axios
        .post(
          "http://localhost:8080/posts/edit",
          { id: postId, title, body },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          if (res.data.message == "success") {
            goto("./");
          }
        });
    }
  };
</script>

<Main>
  {#if user && user.id && user.id == postCreatorId}
    <div class="w-5/12 block m-auto">
      <h1>Edit post</h1>
      <form method="post" on:submit|preventDefault={editPost}>
        <div class="my-6">
          <input
            type="text"
            bind:value={title}
            placeholder="Title"
            class="input input-bordered w-full"
            disabled={formLoading}
          />
        </div>
        <div class="my-6">
          <textarea
            bind:value={body}
            placeholder="Content"
            class="input input-bordered w-full h-32"
            disabled={formLoading}
          ></textarea>
        </div>
        <div class="my-6">
          <button disabled={formLoading} class="btn btn-primary w-full">
            {#if formLoading}
              <span class="loading loading-spinner loading-md"></span>
            {:else}
              Create post
            {/if}
          </button>
        </div>
        {#if error}
          <p class="my-6 text-red-600">
            {error}
          </p>
        {/if}
      </form>
    </div>
  {:else}
    <h1 class="text-center">You don't have access to this page</h1>
  {/if}
</Main>
