<script>
	import { Link } from "svelte-routing";

</script>

	<nav class="navbar navbar-expand-lg">
		<div class="container-fluid">
			<Link class="navbar-brand" to="/">Company</Link>
			<ul class="navbar-nav flex-row">
				<li class="nav-item mx-2">
					<Link to="/">Home</Link>
				</li>
				<li class="nav-item mx-2">
					<Link to="/products">Products</Link>
				</li>
			</ul>
		</div>
	</nav>

