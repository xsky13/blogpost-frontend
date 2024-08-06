<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Main from "../../components/main.svelte";
  import { userStore } from "../../stores";

  let posts = [];
  let user;

  userStore.subscribe((value) => (user = value));

  onMount(() => {
    axios.get("http://localhost:8080/posts/all").then((res) => posts = res.data);
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
        <div class="p-6 mb-6 rounded-lg bg-base-200 w-full">
          <a href="./posts/{post.id}" class="text-xl">{post.title}</a>
        </div>
      {/each}
    {:else}
      <div class="p-10 rounded-box bg-base-200 w-full text-center">
        <p class="text-xl font-bold">There are no posts yet</p>
        <span class="text-sm">Please create some</span>
      </div>
    {/if}
  </div>
</Main>
