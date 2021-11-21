<script>
    export let is_visible;
    export let product = {};

    import axios from "axios";
    import { products } from "../stores.js";
    
    let products_array = [];
    const unsubscribe = products.subscribe((array)=>{
        products_array = array;
    });
    function handle_close() {
        is_visible = false;
    }

    async function handle_delete_submit() {
        try {
            let res = await axios.delete(`http://localhost:5000/admin/product/${product.id}`);

            let found_index = products_array.findIndex(o => o.id === product.id);
            products_array.splice(found_index,1);
            
            products.set(products_array);
            handle_close();
        } catch (error) {
            console.error(error);
        }
    }
</script>

{#if is_visible}
    <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Delete Product</h5>
                    <button on:click={handle_close} type="button" class="btn-close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6">
                            <label for="product_name" class="form-label">Machine Name</label>
                            <input disabled value={product.name} name="product_name" type="text" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-danger">
                        Product with ID #{product.id} will be deleted!
                    </div>
                    <button on:click={handle_delete_submit} type="button" class="btn btn-danger">Delete Product</button>
                </div>
            </div>
        </div>
    </div>
{/if}