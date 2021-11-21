<script>
    export let is_visible;
    export let product = {
        id:0,
        name:"",
        files:[]
    };

    import axios from "axios";
    import { products } from "../stores.js";
    import bin from "../assets/bin.svg";
    
    let products_array = [];
    let new_files = [];
    let old_files_to_delete = [];

    const unsubscribe = products.subscribe((array)=>{
        products_array = array;
    });
    function handle_close() {
        is_visible = false;
    }


    async function handle_edit_submit() {
        try {
            //Product POST
            let res = await axios.put(`http://localhost:5000/admin/product/${product.id}`,{name:product.name});


            //New Files POST
            let form_data = new FormData();
            form_data.append("machine_id",String(product.id));
            new_files.forEach(file => {
                console.log(file);
                form_data.append("files",file);
            });

            let res_files = await axios.post("http://localhost:5000/admin/file_upload", form_data, {
                headers: {
                'Content-Type': 'multipart/form-data'
                }
            });

            //Old Files DELETE  
            old_files_to_delete.forEach(async (file_id) => {
                let res = await axios.delete(`http://localhost:5000/admin/file_delete/${file_id}`);
            });
            old_files_to_delete = [];

            
            let found_index = products_array.findIndex(o => o.id === product.id);
            products_array[found_index] = product;
            products.set(products_array);
            handle_close();
        } catch (error) {
            console.error(error);
        }
    };

    function handle_files(e) {
        new_files = [...new_files, ...e.target.files];
        console.log(new_files);
    };

    async function handle_old_file_delete(i) {
        let file_id = product.files[i].id;
        old_files_to_delete.push(file_id);
        product.files = product.files.filter((o,index) => i!=index);
    };

    function handle_new_file_delete(i) {
        new_files = new_files.filter((o,index) => i!=index);
    };

</script>

<style>
    input[type="file"] {
        display: none;
    }
    .custom-file-upload {
        width:min-content;
    }
</style>

{#if is_visible}
    <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(0, 0, 0, 0.5);">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Product</h5>
                    <button on:click={handle_close} type="button" class="btn-close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-6">
                            <label for="product_name" class="form-label">Machine Name</label>
                            <input bind:value={product.name} name="product_name" type="text" class="form-control">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6 d-flex flex-column">
                            <label for="product_images">Machine Photos</label>
                            <label class="custom-file-upload btn btn-primary" for="product_images">+</label>
                            <input id="product_images" class="btn btn-primary" on:change={handle_files} name="product_images" type="file" multiple>
                        </div>
                        <div class="col-12">
                            <table class="table table-hover">
                                <tbody>
                                    {#each (product.files) as file,i }
                                    <tr>
                                        <td>
                                            {i} {file.file_path}
                                        </td>
                                        <td>
                                            <div>
                                                <div on:click={()=>{handle_old_file_delete(i)}} class="btn btn-danger p-1"><img width="20" src={bin} alt="delete icon"/></div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/each}
                                    {#each (new_files) as file,i }
                                    <tr>
                                        <td>
                                            {i+product.files.length} {file.name}
                                        </td>
                                        <td>
                                            <div>
                                                <div on:click={()=>{handle_new_file_delete(i)}} class="btn btn-danger p-1"><img width="20" src={bin} alt="delete icon"/></div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>  
                <div class="modal-footer">
                    <button on:click={handle_edit_submit} type="button" class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
{/if}