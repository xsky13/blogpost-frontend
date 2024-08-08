<script>
  import { onMount } from "svelte";
  import Main from "../components/main.svelte";
  import { userStore } from "../stores";
  import Loading from "./loading.svelte";
  import axios from "axios";
  import { PUBLIC_REQUEST_URL } from "$env/static/public";

  let user;

  let posts;
  let postsLoading = true;

  userStore.subscribe((value) => {
    user = value;
  });

  onMount(async () => {
    const token = localStorage.getItem("token");
    await axios
      .get(PUBLIC_REQUEST_URL + "/getUserPosts", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
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
          <div
            class="post"
          >
            <a href="./posts/{post.id}" class="font-bold"
              >{post.title}</a
            >
            <div class="text-sm">
              {new Date(post.timeCreated).getUTCDate()}/{new Date(
                post.timeCreated
              ).getUTCMonth() + 1}/{new Date(post.timeCreated).getUTCFullYear()}
            </div>
          </div>
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
