<script>
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { userStore } from "../../stores";
  import { PUBLIC_REQUEST_URL } from "$env/static/public"

  let formLoading = false;

  let user;
  userStore.subscribe((value) => (user = value));

  $: if (user && user.name) {
    goto("/");
  }

  let email = "";
  let password = "";
  let error = "";

  const login = () => {
    formLoading = true;
    axios
      .post(PUBLIC_REQUEST_URL + "/login", { email, password })
      .then((res) => {
        formLoading = false;
        if (res.data.token) {
          // save the token in localstorage
          localStorage.setItem("token", res.data.token);
          userStore.update((value) => (value = res.data.user));
          goto("/");
        } else {
          error = res.data.info.message;
        }
      });
  };
</script>

{#if user == "not_logged_in"}
  <div class="flex flex-col justify-center items-center pt-20">
    <div class="w-96 mt-10">
      <h1>Login</h1>
      <form on:submit|preventDefault={login} method="post">
        <div class="my-6">
          <input
            type="text"
            bind:value={email}
            placeholder="Your email"
            class="input input-bordered w-full"
            disabled={formLoading}
          />
        </div>

        <div class="my-6">
          <input
            type="password"
            bind:value={password}
            placeholder="Your password"
            class="input input-bordered w-full"
            disabled={formLoading}
          />
        </div>
        <div class="my-6">
          <button disabled={formLoading} class="btn btn-primary w-full">
            {#if formLoading}
              <span class="loading loading-spinner loading-md"></span>
            {:else}
              Log in
            {/if}
          </button>
        </div>
        {#if error}
          <p class="text-error">{error}</p>
        {/if}
      </form>
    </div>
  </div>
{/if}
