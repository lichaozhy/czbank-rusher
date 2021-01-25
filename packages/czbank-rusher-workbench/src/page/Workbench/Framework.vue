<template>

<div>
	<navbar></navbar>
	<router-view>Workbench Framework</router-view>
</div>

</template>

<script>
import Navbar from './Navbar';

export default {
	components: {
		Navbar
	}
};
</script>

<style>

</style>
