<template>
  <div id="app">
    <router-view></router-view>
    <song-audio></song-audio>
  </div>
</template>

<script>
import SongAudio from './components/SongAudio'
export default {
  name: 'App',
  components: {
    SongAudio
  }
}
</script>

<style>
</style>
