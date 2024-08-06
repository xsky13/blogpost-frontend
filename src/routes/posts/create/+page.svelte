<script>
  import axios from "axios";
  import Main from "../../../components/main.svelte";
  import { userStore } from "../../../stores";
  import { goto } from "$app/navigation";
  let user;

  let title = "";
  let body = "";
  let formLoading;
  let error;

  userStore.subscribe((value) => (user = value));

  const createPost = () => {
    const token = localStorage.getItem("token");
    console.log();

    if (!title.length || !body.length) {
      error = "Fields can't be empty";
    } else {
      formLoading = true;
      axios
        .post(
          "http://localhost:8080/posts/create",
          { title, body },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          if (res.data.message == "success") {
            goto("./" + res.data.post.id);
          }
        });
    }
  };
</script>

{#if user && user.name}
  <Main>
    <div class="w-5/12 block m-auto">
      <h1>Create post</h1>
      <form method="post" on:submit|preventDefault={createPost}>
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
  </Main>
{/if}
