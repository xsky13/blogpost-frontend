<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Main from "../../components/main.svelte";
  import { userStore } from "../../stores";
  import { PUBLIC_REQUEST_URL } from "$env/static/public";
  import Loading from "../loading.svelte";

  let posts = [];
  let user;

  userStore.subscribe((value) => (user = value));

  onMount(() => {
    axios
      .get(PUBLIC_REQUEST_URL + "/posts/all")
      .then((res) => (posts = res.data));
  });
</script>

<Main>
  <div class="flex justify-between">
    <h1>Posts</h1>
    {#if user && user.name}
      <a href="./posts/create" class="btn btn-primary">Create post</a>
    {/if}
  </div>

  <div class="mt-6">
    {#if posts.length}
      {#each posts as post}
        <div class="post">
          <a href="./posts/{post.id}" class="text-lg font-bold">{post.title}</a>
          <div class="text-sm">
            <div class="float-right">By {post.User.name}</div>
            <br />
            <div class="float-right">
              {new Date(post.timeCreated).getUTCDate()}/{new Date(
                post.timeCreated
              ).getUTCMonth() + 1}/{new Date(post.timeCreated).getUTCFullYear()}
            </div>
          </div>
        </div>
      {/each}
    {:else}
      <div class="block m-auto">
        <Loading />
      </div>
    {/if}
  </div>
</Main>
