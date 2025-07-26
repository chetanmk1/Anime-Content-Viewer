<template>
  <q-page>
    <!-- Header: Date + User Icon -->
    <div v-if="!showFullScreen" class="q-pa-lg">
      <div class="row items-center justify-between q-mb-md">
        <!-- Display Current Date -->
        <div class="column">
          <div class="text-caption text-grey text-bold">{{ todayDate }}</div>
          <div class="text-h5 text-bold">Today</div>
        </div>

        <!-- User Initials Avatar -->
        <q-avatar
          size="32px"
          font-size="14px"
          class="bg-grey-4 text-bold"
          v-if="store.content?.userName"
        >
          {{
            store.content.userName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
          }}
        </q-avatar>
      </div>

      <!-- Main Content Card -->

      <q-card
        v-if="store.content"
        class="q-mb-md overflow-hidden shadow-23"
        style="
          border-radius: 30px;
          width: 100%;
          height: 860px;
          display: flex;
          flex-direction: column;
        "
      >
        <!-- Thumbnail Image Part -->

        <div
          @click="toggleFullScreen"
          style="flex: 1; overflow: hidden; border-radius: 30px 30px 0 0"
        >
          <q-img
            loading="lazy"
            :src="store.content?.thumbNailImage"
            style="width: 100%; height: 100%; object-fit: cover"
          />
        </div>

        <!-- Bottom Content + Actions -->

        <q-card-section
          class="row items-center justify-between q-py-sm q-px-md"
          style="height: 100px; border-radius: 0 0 30px 30px"
        >
          <!-- Logo + Title/SubTitle -->
          <div class="row items-center q-gutter-md">
            <q-avatar
              square
              size="75px"
              class="q-mr-sm"
              style="border-radius: 15px"
            >
              <img :src="store.content.logo" alt="logo" />
            </q-avatar>
            <div class="column">
              <div class="text-bold">{{ store.content.title }}</div>
              <div class="text-grey text-bold">
                {{ store.content.subTitle }}
              </div>
            </div>
          </div>

          <!-- Refresh Button + Label -->
          <div class="column items-center">
            <q-btn
              class="bg-grey-4 text-bold text-primary text-caption q-px-lg q-py-sm q-mb-xs"
              label="Refresh"
              rounded
              flat
              @click.stop="refreshContent"
            />
            <div class="text-grey-7" style="font-size: xx-small">
              In-App Purchase
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Skeleton Loader  -->

      <div v-else>
        <q-skeleton type="rect" height="250px" class="q-mb-md" />
        <q-skeleton type="text" width="60%" class="q-mb-sm" />
        <q-skeleton type="text" width="40%" />
      </div>
    </div>

    <!-- Fullscreen View -->
    <div
      v-if="showFullScreen"
      class="FullScreen"
      style="position: relative; width: 100vw; height: 100vh"
    >
      <!-- Close Button (Top Right) -->
      <q-btn
        class="bg-grey-4"
        dense
        flat
        round
        icon="close"
        color="black"
        @click="showFullScreen = false"
        style="position: fixed; top: 10px; right: 10px; z-index: 1000"
      />

      <!-- Fullscreen Thumbnail Image -->
      <q-img loading="lazy" :src="store.content?.thumbNailImage" />

      <!-- Bottom Card: Logo + Titles + Refresh -->
      <div
        class="row items-center justify-between q-py-sm q-px-xl"
        style="height: 100px; border-radius: 0 0 30px 30px"
      >
        <!-- Logo + Title -->
        <div class="row items-center q-gutter-md">
          <q-avatar
            square
            size="75px"
            class="q-mr-sm"
            style="border-radius: 15px"
          >
            <img :src="store.content?.logo" alt="logo" />
          </q-avatar>
          <div class="column">
            <div class="text-bold">{{ store.content?.title }}</div>
            <div class="text-grey text-bold">
              {{ store.content?.subTitle }}
            </div>
          </div>
        </div>

        <!-- Refresh Button + Info -->
        <div class="column items-center">
          <q-btn
            class="bg-grey-4 text-bold text-primary q-px-lg q-py-sm q-mb-xs"
            label="Refresh"
            rounded
            flat
            @click.stop="refreshContent"
          />
          <div class="text-grey-7" style="font-size: xx-small">
            In-App Purchase
          </div>
        </div>
      </div>

      <q-separator size="0.2rem" />

      <!-- Full Description with Inline Image -->
      <div class="q-pa-lg">
        <!-- All Initial Paragraphs -->
        <div v-html="paragraphs.before"></div>

        <!-- Main Inline Image -->
        <div class="mainImage q-my-md">
          <q-img loading="lazy" :src="store.content.mainImage" />
        </div>

        <!-- Last Paragraph -->
        <div v-html="paragraphs.last"></div>
      </div>

      <!-- Final Section: Logo + Title  + Refresh Button -->
      <div
        class="bg-grey-4 q-pa-lg column items-center justify-center q-gutter-md"
      >
        <!-- Logo Avatar -->
        <q-avatar square size="75px" style="border-radius: 15px">
          <img :src="store.content.logo" alt="logo" />
        </q-avatar>

        <!-- Title & Subtitle -->
        <div class="column items-center">
          <div class="text-bold">{{ store.content.title }}</div>
          <div class="text-grey text-bold">{{ store.content.subTitle }}</div>
        </div>

        <!-- Refresh Button -->
        <div class="column items-center">
          <q-btn
            class="text-bold bg-primary q-px-lg q-py-sm q-mb-xs"
            text-color="white"
            label="Refresh"
            rounded
            flat
            @click.stop="refreshContent"
          />
          <div class="text-grey-7 q-mt-xs" style="font-size: xx-small">
            In-App Purchase
          </div>
        </div>
      </div>

      <!-- Share Story Button -->
      <div class="q-pa-xl column items-center justify-center">
        <q-btn
          class="bg-grey-4"
          icon="upload"
          text-color="primary"
          label="Share Story"
          flat
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { useContentStore } from "src/stores/contentStore";
import moment from "moment";

export default {
  name: "AnimeCardPage",

  data() {
    return {
      store: useContentStore(), // Pinia store (state management library) to manage content and tokens
      showFullScreen: false, // Toggle state for full-screen view
    };
  },

  async mounted() {
    // Generate token once on mount
    await this.store.generateToken("chetankuri6@gmail.com");

    // Fetch anime content from API
    await this.store.fetchContent();
  },

  computed: {
    // Format today's date
    todayDate() {
      return moment().format("dddd DD MMMM").toUpperCase();
    },

    // Extract paragraphs from the HTML content
    // Returns everything except last paragraph as `before`
    // and last paragraph separately as `last`
    paragraphs() {
      const htmlText = this.store.content.text || "";
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const allParagraphs = Array.from(doc.querySelectorAll("p"));

      if (allParagraphs.length === 0) {
        return { before: htmlText, last: "" };
      }

      const lastPara = allParagraphs.pop();
      const wrapper = document.createElement("div");
      allParagraphs.forEach((p) => wrapper.appendChild(p));

      return {
        before: wrapper.innerHTML,
        last: lastPara.outerHTML,
      };
    },
  },

  methods: {
    // Refresh content on button click with error handling
    async refreshContent() {
      try {
        await this.store.fetchContent();
      } catch (error) {
        console.error("Failed to refresh content:", error);
      }
    },

    // Toggle full-screen view (used for expand/collapse)
    toggleFullScreen() {
      this.showFullScreen = !this.showFullScreen;
    },
  },
};
</script>

<style scoped>
/* Bold text utility */
.text-bold {
  font-weight: bold;
}
</style>
