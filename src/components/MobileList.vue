<template>
  <div>
    <Flicking :options="{ renderOnlyVisible: true, resizeOnContentsReady: true }" class="flicking-container">
      <div v-for="place in place_store.db_filtered" :key="place.id" class="flicking-panel relative mx-4 overflow-hidden rounded-2xl bg-cafe-50 shadow-md">
        <PlaceCard :place="place" />
      </div>
    </flicking>
  </div>
</template>

<script setup lang="ts">
import Flicking from '@egjs/vue3-flicking'

const place_store = use_place_store()
</script>

<style>
.flicking-container {
  @apply flex w-full overflow-hidden
}

.flicking-panel {
  flex: none;
  @apply p-0 w-7/10 h-full
}
.flicking-camera {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: row;
    z-index: 1;
}

.is-justify-content-center {
    justify-content: center!important;
}
.is-flex {
    display: flex!important;
}
.button {
    color: #3e8ed0;
    border:1px solid #3e8ed0;
    justify-content: center;
    padding: 10px;
    text-align: center;
    white-space: nowrap;
    border-radius: 3px;
    cursor: pointer;
}
.mr-2{
    margin-right: 5px;
}

.flicking-arrow-next, .flicking-arrow-prev {
    position: absolute;
    top: 50%;
    width: 64px;
    height: 64px;
    cursor: pointer;
    transform: translateY(-50%);
    z-index: 2;
}

.flicking-arrow-next {
    right: 10px;
}

.flicking-arrow-prev {
    left: 10px;
}
.flicking-arrow-next:after, .flicking-arrow-next:before, .flicking-arrow-prev:after, .flicking-arrow-prev:before {
    content: "";
    width: 24px;
    height: 6px;
    position: absolute;
    background-color: #f2a65e;

}
.flicking-arrow-prev:before {
    top: 50%;
    left: 22px;
    transform: rotate(-45deg);
    transform-origin: 0 50%;
}
.flicking-arrow-next:before {
    top: 50%;
    right: 22px;
    transform: rotate(45deg);
    transform-origin: 100% 50%;
}
.flicking-arrow-next.is-circle:after, .flicking-arrow-next.is-circle:before, .flicking-arrow-prev.is-circle:after, .flicking-arrow-prev.is-circle:before {
    background-color: #fff;
}
</style>
