<script>
  import Main from "../../../../components/main.svelte";
  import { userStore } from "../../../../stores";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { PUBLIC_REQUEST_URL } from "$env/static/public";
  import Loading from "../../../loading.svelte";

  let postLoading = true;
  let title;
  let body;
  let error;
  let formLoading = false;

  let postId;

  let postCreatorId;
  let user;
  userStore.subscribe((value) => (user = value));

  onMount(async () => {
    await axios
      .get(`${PUBLIC_REQUEST_URL}/posts/${$page.params.id}`)
      .then((res) => {
        postId = res.data.post.id;
        title = res.data.post.title;
        body = res.data.post.body;
        postCreatorId = res.data.user.id;
        postLoading = false;
      });
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
          PUBLIC_REQUEST_URL + "/posts/edit",
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
  {#if postLoading}
    <div class="block m-auto">
      <Loading />
    </div>
  {:else if user && user.id && user.id == postCreatorId}
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
              Edit post
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
