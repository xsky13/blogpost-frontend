<script>
  import { onMount } from "svelte";
  import Main from "../components/main.svelte";
  import { userStore } from "../stores";
  import Loading from "./loading.svelte";
  import axios from "axios"

  let user;

  let posts;
  let postsLoading = true;

  userStore.subscribe((value) => {
    user = value;
  });

  onMount(async () => {
    const token = localStorage.getItem("token");
    await axios
      .get("http://localhost:8080/getUserPosts", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(res => {
        postsLoading = false;
        posts = res.data.posts;
      });
  });

</script>

<Main>
  {#if user && user.name}
    <h1>Welcome {user.name}</h1>
    <div class="mt-6">
      <h3>Your posts:</h3>
      {#if postsLoading}
        <div class="text-center">
          <Loading />
        </div>
      {:else}
        {#each posts as post}
          <a href={"posts/" + post.id} class="flex justify-between items-center my-6 shadow-sm bg-base-200 py-3 px-5 rounded-lg">
            <span class="font-bold">
              {post.title}
            </span>
            <span class="text-sm">
              Created on {new Date(post.timeCreated).getUTCDate()}/{new Date(post.timeCreated).getUTCMonth() + 1}/{new Date(post.timeCreated).getUTCFullYear()}
            </span>
          </a>
        {/each}
      {/if}
    </div>
  {:else if user == "not_logged_in"}
    <div class="flex flex-col items-center">
      <h1>Welcome!</h1>
      <a href="/login" class="btn btn-primary mt-6 w-52">Sign in</a>
    </div>
  {/if}
</Main>
