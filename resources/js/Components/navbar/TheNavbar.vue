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
import { visit } from '@/lib/routes';
import logoUrl from '@img/trifolium-logo.png';

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
    <nav class="nav" style="position: sticky; top: 0">
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
                    style="padding-top: 4px; padding-bottom: 4px; padding-left: 42px"
                >
                    <a
                        :class="['nav__link', { 'nav__link--active': route === link.id }]"
                        style="display: inline-flex; align-items: center; gap: 7px"
                        @click="go(link.id)"
                    >
                        <Icon :name="link.icon" :size="17" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                        {{ link.label }}
                    </a>
                </NewRibbon>
                <a
                    v-else
                    :class="['nav__link', { 'nav__link--active': route === link.id }]"
                    style="display: inline-flex; align-items: center; gap: 7px"
                    @click="go(link.id)"
                >
                    <Icon :name="link.icon" :size="17" :color="route === link.id ? 'var(--accent)' : 'var(--ink-3)'" :stroke="1.6" />
                    {{ link.label }}
                </a>
            </template>
        </div>

        <!-- Center: official Trifolium logo (typographic fallback if it fails to load).
             .nav__center: on phones the mobile stylesheet absolutely centers this
             so uneven side clusters can't push the logo off-center. -->
        <div
            class="nav__center"
            style="display: flex; align-items: center; justify-content: center; cursor: pointer; height: 100%"
            @click="go('home')"
        >
            <img
                v-if="!logoFailed"
                :src="logoUrl"
                alt="Trifolium"
                style="height: 44px; width: auto; display: block"
                @error="logoFailed = true"
            />
            <div v-else style="display: flex; flex-direction: column; align-items: center; gap: 2px">
                <svg width="22" height="14" viewBox="0 0 32 20" fill="none" style="display: block">
                    <circle cx="10" cy="8" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                    <circle cx="22" cy="8" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                    <circle cx="16" cy="14" r="6" fill="none" stroke="var(--accent)" stroke-width="1.4" />
                </svg>
                <span
                    :style="{
                        fontFamily: `'Cormorant Garamond', serif`,
                        fontSize: '22px',
                        fontWeight: 500,
                        letterSpacing: '0.04em',
                        lineHeight: 1,
                        color: 'var(--ink)',
                        marginTop: '2px',
                    }"
                >Trifolium</span>
            </div>
        </div>

        <!-- Left column: actions + user -->
        <div
            :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifySelf: 'end',
                flexDirection: 'row-reverse',
                whiteSpace: 'nowrap',
            }"
        >
            <!-- points — gold coin + bold count (no "נקודות" label) -->
            <span class="nav__desktop-only"><PointsBadge :value="user.points" /></span>

            <!-- Mobile identity: first name + points, compact (CSS-gated;
                 hidden on desktop where the full user menu carries these). -->
            <span class="nav__mobile-id">
                <span class="nav__mobile-id__name">{{ user.name }}</span>
                <PointsBadge :value="user.points" />
            </span>

            <span class="nav__desktop-only"><UserMenu :user="user" @navigate="go" /></span>

            <span class="nav__desktop-only" style="width: 1px; height: 26px; background: var(--line); margin: 0 2px" />

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
