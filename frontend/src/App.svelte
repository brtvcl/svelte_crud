<svelte:head>
	<link rel="stylesheet" href="../node_modules/bootstrap/dist/css/bootstrap.min.css">
</svelte:head>


<script>
	import { Router, Link, Route } from "svelte-routing";
	import Home from "./routes/Home.svelte";
	import Products from "./routes/Products.svelte";
	import Navbar from "./components/Navbar.svelte";
	import Admin from "./routes/Admin.svelte";
	export let url = "";
</script>



<Router url="{url}">
	
	<div class="container">
		<Navbar/>
		<Route path="/products"  component="{Products}" />
		<Route path="/" component="{Home}"/>
		<Route path="/admin" component="{Admin}"/>
	</div>
</Router>