<script lang="ts">
    export let remainingMs: number

    let minutes: number
    let seconds: number
    let milliseconds: number

    $: minutes = Math.floor(remainingMs / 1000 / 60)
    $: seconds = Math.floor((remainingMs / 1000) % 60)
    $: milliseconds = Math.floor((remainingMs % 1000) / 10)
</script>

<div>
    <span>
        {minutes}
    </span>
    <span>:</span>
    <span>
        {seconds}
    </span>
    <span>:</span>
    <span>
        {milliseconds}
    </span>
</div>
