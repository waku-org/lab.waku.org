<script lang="ts">
	import History from '$lib/components/History.svelte';
	import StateGraphDashboard from '$lib/components/StateGraphDashboard.svelte';
	import StateGraphSummary from '$lib/components/StateGraphSummary.svelte';
</script>

<div class="mx-1 flex h-full flex-row" style="overflow: hidden;">
	<!-- History Sidebar -->
	<div
		class="top-0 right-0 left-0 mr-1 rounded-lg bg-white sm:shadow-md"
		style="
    background-color: rgb(201 201 201);
    display: flex;
"
	>
		<History />
	</div>

	<div class="flex w-full flex-col overflow-hidden">
		<!-- Summary State Graph -->
		<div
			class="top-0 right-0 left-0 mb-1 h-full w-full flex-5 basis-3/4 rounded-lg bg-white p-8 sm:shadow-md"
			style="
    background-color: rgb(182 195 206);
        align-content: center;
		overflow: auto;
"
		>
			<StateGraphSummary />
		</div>
		<!-- Detailed State Graph
		<div
			class="top-0 right-0 left-0 basis-1/4 rounded-lg bg-white p-1 sm:shadow-md"
			style="
    background-color: rgb(151 174 194);
    width: 100%;
"
		>
			<StateGraphDashboard />
		</div> -->
	</div>
</div>
