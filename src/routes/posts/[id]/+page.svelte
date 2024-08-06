<script>
  import axios from "axios";
  import Main from "../../../components/main.svelte";
  import { userStore } from "../../../stores";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let post = {};
  let postCreator = {};
  let timeCreated = {};

  let user;
  userStore.subscribe((value) => (user = value));

  onMount(() => {
    axios.get(`http://localhost:8080/posts/${$page.params.id}`).then((res) => {
      post = res.data.post;
      postCreator = res.data.user;
      const date = new Date(post.timeCreated);

      timeCreated.day = date.getUTCDate();
      timeCreated.month = date.getUTCMonth() + 1;
      timeCreated.year = date.getUTCFullYear();
    });
  });

  const deletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (post.userId == user.id) {
        const token = localStorage.getItem("token");
        await axios
          .post(
            "http://localhost:8080/posts/delete",
            { id: post.id },
            { headers: { Authorization: "Bearer " + token } }
          )
          .then((res) => {
            if (res.data.message == "success") {
              goto("./");
            }
          });
      }
    }
  };
</script>

<Main>
  <div class="flex justify-between">
    <h1>{post.title}</h1>
    {#if postCreator.id == user.id}
      <div class="flex">
        <a href="./{$page.params.id}/edit" class="btn btn-primary mr-6">Edit</a>
        <button on:click={deletePost} class="btn btn-outline">Delete</button>
      </div>
    {/if}
  </div>
  <div class="my-6">
    <p>{post.body}</p>
  </div>
  <p>
    By {postCreator.name} on {timeCreated.day}/{timeCreated.month}/{timeCreated.year}
  </p>
</Main>
