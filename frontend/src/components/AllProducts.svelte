<script>

    import { Router, Link, Route, navigate } from "svelte-routing";
    import { link } from "svelte-routing";

    import axios from "axios";
    import { each } from "svelte/internal";
    
    let products = [];
    axios.get("http://localhost:5000/products")
        .then((res)=>{
            products = res.data;
            console.log(res.data);
        })
        .catch((err)=>{

        });
</script>

<div class=row>
{#each products as product,i }
    <div class="col-6 col-md-3 mb-3">
        <div class="d-flex flex-column">
            {#if (product.files[0])}
                <img src={"http://localhost:5000/uploads/"+product.files[0].file_path} alt="landscape" />
            {/if}
            <h5>{product.name}</h5>
        </div>
    </div>
{/each}

    
</div>
