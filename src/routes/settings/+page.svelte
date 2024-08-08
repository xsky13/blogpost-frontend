<script>
  import Main from "../../components/main.svelte";
  import { userStore } from "../../stores";
  import { goto } from "$app/navigation";
  import Loading from "../loading.svelte";
  import axios from "axios";
  import { PUBLIC_REQUEST_URL } from "$env/static/public"

  let user;

  $: if (user == "not_logged_in") {
    goto("/");
  }

  let name;
  let email;
  let error;
  let formLoading;

  userStore.subscribe((value) => {
    user = value;
    name = value.name;
    email = value.email;
  });

  const editInfo = () => {
    const token = localStorage.getItem("token");

    if (name.length == 0) {
      error = "Name can't be empty";
    } else if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      error = "Email is invalid";
    } else {
      formLoading = true;
      axios
        .post(
          PUBLIC_REQUEST_URL + "/edit",
          { name, email },
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((res) => {
          formLoading = false;
          if (res.data.message !== "Success") {
            error = res.data.message;
          } else {
            error = "";
            // Update the store
            userStore.update((current) => ({ ...current, name, email }));
            alert("Successfully saved settings");
          }
        });
    }
  };
</script>

{#if user && user.name}
  <Main>
    <div class="w-5/12 block m-auto">
      <h1>Edit your info</h1>
      <form method="post" on:submit|preventDefault={editInfo}>
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
          <button disabled={formLoading} class="btn btn-primary w-full">
            {#if formLoading}
              <span class="loading loading-spinner loading-md"></span>
            {:else}
              Submit changes
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
{:else if user == "loading"}
  <Loading />
{/if}
