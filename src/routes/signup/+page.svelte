<script>
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { userStore } from "../../stores";
  import { PUBLIC_REQUEST_URL } from "$env/static/public"

  let user;
  userStore.subscribe((value) => (user = value));

  $: if (user && user.name) {
    goto("/");
  }

  let name = "";
  let email = "";
  let password = "";
  let error = "";
  let formLoading = false;

  const signup = () => {
    if (!name.length) {
      error = "Name can't be empty";
    } else if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      error = "Email is invalid";
    } else if (password.length < 6) {
      error = "Password must be at least 6 characters long";
    } else {
      error = "";
      formLoading = true;
      axios
        .post(PUBLIC_REQUEST_URL + "/signup", { name, email, password })
        .then((res) => {
          formLoading = false;
          if (res.data.message == "success") {
            goto("/login");
          } else {
            error = res.data.message;
          }
        });
    }
  };
</script>


{#if user == "not_logged_in"}
  <div class="flex flex-col justify-center items-center pt-20">
    <div class="w-96 mt-10">
      <h1>Sign Up</h1>
      <form on:submit|preventDefault={signup} method="post">
        <div class="my-6">
          <input
            type="text"
            bind:value={name}
            placeholder="Your name"
            class="input input-bordered w-full"
            disabled={formLoading}
          />
        </div>

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
              Sign Up
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
