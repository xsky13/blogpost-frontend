<script>
  import { onMount } from "svelte";
  import { getUser, logout } from "$lib/index";
  import { userStore } from "../stores";
  import "../app.css";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import Loading from "./loading.svelte";

  let loading = false;

  beforeNavigate(() => {
    loading = true;
  });

  afterNavigate(() => {
    loading = false;
  });

  let token;
  let user;

  onMount(() => {
    token = localStorage.getItem("token");
    if (token) {
      getUser().then((res) => userStore.set(res));
    } else {
      userStore.set("not_logged_in");
    }
  });

  userStore.subscribe((value) => (user = value));
</script>

{#if loading}
  <Loading />
{:else}
  <div class="navbar border-b dark:border-gray-500 border-gray-200 fixed w-full">
    <div class="navbar-start">
      <a href="/" class="btn btn-ghost text-xl">Blogpost</a>
    </div>

    {#if user.name}
      <div class="navbar-center form-control">
        <input
          type="text"
          placeholder="Search posts"
          class="input input-bordered w-72"
        />
      </div>
      <div class="navbar-end">
        <a href="/posts" class="btn btn-ghost mr-3">All posts</a>
        <a href="/settings" class="btn btn-ghost mr-3">Edit info</a>
        <button on:click={() => logout(token)} class="btn btn-neutral"
          >Log out</button
        >
      </div>
    {:else}
      <div class="navbar-end">
        <ul class="menu menu-horizontal px-1">
          <li><a href="./login">Login</a></li>
          <li><a href="./signup">Signup</a></li>
        </ul>
      </div>
    {/if}
  </div>
  <slot />
{/if}
