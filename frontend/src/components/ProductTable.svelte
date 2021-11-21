<script>
    import DeleteProductModal from "../components/DeleteProductModal.svelte";
    import EditProductModal from "../components/EditProductModal.svelte";
    import AddProductModal from "../components/AddProductModal.svelte";
    import { products } from "../stores.js";
    import axios from "axios";
    import pen from "../assets/pen.svg";
    import bin from "../assets/bin.svg";

    let edit_is_visible = false;
    let delete_is_visible = false;
    let add_is_visible = false;
    let products_array = [];
    let product = {
        id:0,
        name:"",
        files:[]
    };

    const unsubscribe = products.subscribe((array)=>{
        products_array = array;
    });

    function get_products() {
        axios.get("http://localhost:5000/products")
        .then((res)=>{
            products.set(res.data); 
        })
        .catch((err)=>{
            console.error(err);
        });
    };
    get_products();
    

    function handle_edit(new_product) {
        product = new_product;
        edit_is_visible = true;
    };

    
    function handle_delete(new_product) {
        product = new_product;
        delete_is_visible = true;
    };
</script>
<AddProductModal bind:is_visible={add_is_visible}/>
<DeleteProductModal product={product} bind:is_visible={delete_is_visible}/>
<EditProductModal product={product} bind:is_visible={edit_is_visible}/>
<div class="row">
    <div class="col">
        <div on:click={()=>{add_is_visible = true;}} class="btn btn-primary">+</div>
    </div>
</div>
<div class="row justify-content-center">
    <div class="col-12">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {#each products_array as p,i }
                <tr>
                    <td>{p.id}</td>
                    <td class="w-100">{p.name}</td>
                    <td>
                        <div class="d-flex">
                            <div on:click={()=>{handle_edit(p)}} class="btn btn-primary me-2">
                                <img src={pen} alt="edit pen"/>
                            </div>
                            <div on:click={()=>{handle_delete(p)}} class="btn btn-primary ms-2">
                                <img src={bin} alt="delete bin"/>
                            </div>
                        </div>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>

