<script setup>
// Top navigation bar — 3-column grid. Center: Trifolium brand logo.
// Right (RTL start): the four main destinations. Left: points · user · cart.
import { ref } from 'vue';
import Icon from '@/Components/ui/Icon.vue';
import NewRibbon from '@/Components/ui/NewRibbon.vue';
import IconAction from '@/Components/navbar/IconAction.vue';
import PointsBadge from '@/Components/navbar/PointsBadge.vue';
import UserMenu from '@/Components/navbar/UserMenu.vue';
import MobileDrawer from '@/Components/navbar/MobileDrawer.vue';
import { NAV_LINKS } from '@/Components/navbar/nav-links.js';
import { visit, routeUrl } from '@/lib/routes';
import logoUrl from '@img/trifolium-logo.png';
import markUrl from '@img/trifolium-mark.png';

defineProps({
    /** Logical name of the active screen (see lib/routes.js). */
    route: { type: String, default: '' },
    /** { name, initials, points } — TODO(backend): auth user via Inertia shared props. */
    user: { type: Object, required: true },
    cartCount: { type: Number, default: 0 },
    pendingCount: { type: Number, default: 0 },
});

const logoFailed = ref(false);
const drawerOpen = ref(false);

function go(id) {
    drawerOpen.value = false;
    visit(id);
}
</script>

<template>
    <nav class="nav sticky top-0">
        <!-- Right column (RTL): main menu links (desktop) + burger (mobile) -->
        <div class="nav__links">
            <button class="nav__burger" aria-label="תפריט" :aria-expanded="drawerOpen" @click="drawerOpen = true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
            </button>
            <template v-for="link in NAV_LINKS" :key="link.id">
                <!-- "הפורמולות שלי" is new vs. the previous system → corner ribbon. -->
                <NewRibbon
                    v-if="link.id === 'my-formulas'"
                    :radius="7"
                    :top="10"
                    :left="-30"
                    class="pt-[4px] pb-[4px] pl-[42px]"
                >
                    <a
                        :class="['nav__link', { 'nav__link--active': route === link.id }]"
                        class="inline-flex items-center gap-[7px]"
                        :href="routeUrl(link.id)"
                        @click.prevent="go(link.id)"
                    >
                        <Icon :name="link.icon" :size="17" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                        {{ link.label }}
                    </a>
                </NewRibbon>
                <a
                    v-else
                    :class="['nav__link', { 'nav__link--active': route === link.id }]"
                    class="inline-flex items-center gap-[7px]"
                    :href="routeUrl(link.id)"
                    @click.prevent="go(link.id)"
                >
                    <Icon :name="link.icon" :size="17" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                    {{ link.label }}
                </a>
            </template>
        </div>

        <!-- Center: official Trifolium logo (typographic fallback if it fails to load).
             .nav__center: on phones the mobile stylesheet absolutely centers this
             so uneven side clusters can't push the logo off-center. -->
        <a
            class="nav__center flex items-center justify-center h-full cursor-pointer"
            :href="routeUrl('home')"
            aria-label="Trifolium — דף הבית"
            @click.prevent="go('home')"
        >
            <img
                v-if="!logoFailed"
                :src="logoUrl"
                alt="Trifolium"
                class="nav__logo-full block h-[44px] w-auto"
                @error="logoFailed = true"
            />
            <!-- Phones: the circular brand mark alone (the full lockup is too
                 wide next to the identity cluster). CSS-gated. -->
            <img
                v-if="!logoFailed"
                :src="markUrl"
                alt="Trifolium"
                class="nav__logo-mark"
            />
            <div v-else class="flex flex-col items-center gap-[2px]">
                <svg width="22" height="14" viewBox="0 0 32 20" fill="none" class="block">
                    <circle cx="10" cy="8" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                    <circle cx="22" cy="8" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                    <circle cx="16" cy="14" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                </svg>
                <span
                    class="mt-[2px] font-['Cormorant_Garamond',serif] text-[22px] font-medium tracking-[0.04em] leading-[1] text-ink"
                >Trifolium</span>
            </div>
        </a>

        <!-- Left column: actions + user -->
        <div class="flex flex-row-reverse items-center gap-[12px] justify-self-end whitespace-nowrap">
            <!-- points — gold coin + bold count (no "נקודות" label) -->
            <span class="nav__desktop-only"><PointsBadge :value="user.points" /></span>

            <!-- Mobile identity: first name + points, compact (CSS-gated;
                 hidden on desktop where the full user menu carries these). -->
            <span class="nav__mobile-id">
                <span class="nav__mobile-id__name">{{ user.name }}</span>
                <PointsBadge :value="user.points" />
            </span>

            <span class="nav__desktop-only"><UserMenu :user="user" @navigate="go" /></span>

            <span class="nav__desktop-only w-[1px] h-[26px] mx-[2px] my-0 bg-(--line)" />

            <!-- On phones the cart lives in the bottom tab bar (nav__top-cart hides this). -->
            <span class="nav__top-cart">
                <IconAction icon="cart" tooltip="סל הקניות" :count="cartCount" :active="route === 'cart'" @click="go('cart')" />
            </span>
            <span class="nav__desktop-only">
                <IconAction
                    icon="cart_clock"
                    tooltip="הזמנות בהמתנה"
                    :count="pendingCount"
                    :active="route === 'pending'"
                    @click="go('pending')"
                />
            </span>
        </div>

        <MobileDrawer
            :open="drawerOpen"
            :route="route"
            :user="user"
            :cart-count="cartCount"
            :pending-count="pendingCount"
            @close="drawerOpen = false"
            @navigate="go"
        />
    </nav>
</template>
