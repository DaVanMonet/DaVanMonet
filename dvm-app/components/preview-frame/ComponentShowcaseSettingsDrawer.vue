<template>
	<div class="showcase__settings-drawer">
		<div class="showcase__settings-drawer-toolbar">
			<button
				@click="onStateButtonClick()"
				:class="{ 'showcase__show-settings-drawer-button--is-expanded': isSettingsDrawerExpanded }"
				class="showcase__show-settings-drawer-button">
				<template v-if="!isSettingsDrawerExpanded">Show details</template>
				<template v-else>Hide details</template>
			</button>

			<ul class="showcase__size-selector" v-if="this.cssBreakpoints">
				<li
					v-for="cssBreakpoint in this.cssBreakpoints"
					:class="[
						`showcase__size-selector-button--${cssBreakpoint.title}`,
						cssBreakpoint.title === selectedCssBreakpointTitle ? 'showcase__size-selector-button--is-active': ''
					]"
					:key="cssBreakpoint.id"
					@click="onCssBreakpointChange(cssBreakpoint)"
					class="showcase__size-selector-button"
					v-html="cssBreakpoint.title">
						
						<!-- <svg v-if="cssBreakpoint.id === 'mobile'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M537.6 921.6h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path class="path2" d="M742.4 1024h-460.8c-42.347 0-76.8-34.451-76.8-76.8v-870.4c0-42.347 34.453-76.8 76.8-76.8h460.8c42.349 0 76.8 34.453 76.8 76.8v870.4c0 42.349-34.451 76.8-76.8 76.8zM281.6 51.2c-14.115 0-25.6 11.485-25.6 25.6v870.4c0 14.115 11.485 25.6 25.6 25.6h460.8c14.115 0 25.6-11.485 25.6-25.6v-870.4c0-14.115-11.485-25.6-25.6-25.6h-460.8z"></path><path d="M691.2 819.2h-358.4c-14.138 0-25.6-11.461-25.6-25.6v-665.6c0-14.138 11.462-25.6 25.6-25.6h358.4c14.139 0 25.6 11.462 25.6 25.6v665.6c0 14.139-11.461 25.6-25.6 25.6zM358.4 768h307.2v-614.4h-307.2v614.4z"></path></svg>
						<svg v-if="cssBreakpoint.id === 'tablet'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M844.8 1024h-665.6c-42.347 0-76.8-34.451-76.8-76.8v-870.4c0-42.347 34.453-76.8 76.8-76.8h665.6c42.349 0 76.8 34.453 76.8 76.8v870.4c0 42.349-34.451 76.8-76.8 76.8zM179.2 51.2c-14.115 0-25.6 11.485-25.6 25.6v870.4c0 14.115 11.485 25.6 25.6 25.6h665.6c14.115 0 25.6-11.485 25.6-25.6v-870.4c0-14.115-11.485-25.6-25.6-25.6h-665.6z"></path><path d="M537.6 921.6h-51.2c-14.138 0-25.6-11.461-25.6-25.6s11.462-25.6 25.6-25.6h51.2c14.139 0 25.6 11.461 25.6 25.6s-11.461 25.6-25.6 25.6z"></path><path d="M793.6 819.2h-563.2c-14.138 0-25.6-11.461-25.6-25.6v-665.6c0-14.138 11.462-25.6 25.6-25.6h563.2c14.139 0 25.6 11.462 25.6 25.6v665.6c0 14.139-11.461 25.6-25.6 25.6zM256 768h512v-614.4h-512v614.4z"></path></svg>
						<svg v-if="cssBreakpoint.id === 'desktop'" viewBox="0 0 1024 1024" width="100%" height="100%"><path d="M896 102.4h-819.2c-42.347 0-76.8 34.453-76.8 76.8v512c0 42.349 34.453 76.8 76.8 76.8h384v102.4h-179.2c-14.138 0-25.6 11.461-25.6 25.6s11.462 25.6 25.6 25.6h409.6c14.139 0 25.6-11.461 25.6-25.6s-11.461-25.6-25.6-25.6h-179.2v-102.4h384c42.349 0 76.8-34.451 76.8-76.8v-512c0-42.347-34.451-76.8-76.8-76.8zM921.6 691.2c0 14.115-11.485 25.6-25.6 25.6h-819.2c-14.115 0-25.6-11.485-25.6-25.6v-512c0-14.115 11.485-25.6 25.6-25.6h819.2c14.115 0 25.6 11.485 25.6 25.6v512z"></path></svg> -->
				</li>
			</ul>

			<span class="showcase__render-state">{{ selectedStateTitle }} on {{ selectedCssBreakpointTitle+"".toLowerCase() }}</span>
		</div>

		<div v-if="isSettingsDrawerExpanded" class="showcase__settings-drawer-expanded container-fluid">
			<div class="row">
				<div class="col-md-3">
					<div class="demo-form-group__label">Viewport size</div>
					<div v-for="cssBreakpoint in this.cssBreakpoints" :key="cssBreakpoint.title" class="demo-radio-button demo-radio-button--white">
						<input
							:checked="cssBreakpoint.title === selectedCssBreakpointTitle"
							:value="cssBreakpoint.title"
							:id="cssBreakpoint.title"
							@change="onCssBreakpointChange(cssBreakpoint)"
							class="demo-radio-button__input visually-hidden"
							type="radio">
						<label class="demo-radio-button__label" :for="cssBreakpoint.title">
							<div class="demo-radio-button__custom-radio-button"></div>
							{{ cssBreakpoint.title }}
						</label>
					</div>
				</div>
				<div class="col-md-3">
					<div class="demo-form-group__label">States</div>
					<div v-for="state in states" :key="state.Title" class="demo-radio-button demo-radio-button--white">
						<input
							:checked="state.Title === selectedStateTitle"
							:value="state.Title"
							:id="state.Title"
							@change="onStateChange(state.Title)"
							class="demo-radio-button__input visually-hidden"
							type="radio">
						<label class="demo-radio-button__label" :for="state.Title">
							<div class="demo-radio-button__custom-radio-button"></div>
							{{ state.Title }}
						</label>
					</div>
				</div>
				<div class="col-md-3">
					<div v-if="showcaseRepo.Name" class="mb-4">
						<div class="demo-form-group__label mb-2">Repo</div>
						<a class="showcase__repo-link" :href="showcaseRepo.BaseUrlToPatternLibrary" target="_blank">{{ showcaseRepo.Name }}</a>
					</div>
					<div v-if="showcaseRepo.Version" class="mb-4">
						<div class="demo-form-group__label mb-2">Version</div>
						<div>{{ showcaseRepo.Version }}</div>
					</div>
				</div>
				<div class="col-md-3">
					<div v-if="itemKey" class="mb-4">
						<div class="demo-form-group__label mb-2">Article identifier</div>
						<div>
							<copy-to-clipboard title="Copy to clipboard" :copy-data="itemKey">
								<a href="javascript:;" class="showcase__copy-link">{{ itemKey }}</a>
							</copy-to-clipboard>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
//import CONFIG from '@/config';
import CopyToClipboard from '@/components/CopyToClipboard';

export default {
	name: 'component-showcase-settings-drawer',
	components: { CopyToClipboard },
	props: [
		'states',
		'selectedStateTitle',
		'isSettingsDrawerExpanded',
		'cssBreakpoints',
		'selectedCssBreakpointTitle',
		'showcaseRepo',
		'itemKey'
	],
	data() {
		return {
			savedBreakpointTitle:null,
			saveStateTitle:null
		}
	},
	computed: {
		artifactoryHref() {
			return `${CONFIG.ARTIFACTORY_URL}/${this.showcaseRepo.Name}`;
		},
		reverseCssBreakpoints() {
			return this.cssBreakpoints.slice().reverse();
		},
	},
	methods: {
		onStateChange(stateTitle) {
			this.$emit('update:selectedStateTitle', stateTitle);
			if(sessionStorage && stateTitle)
			{
				sessionStorage.setItem("saveStateTitle", stateTitle);
			}
		},
		onStateButtonClick() {
			this.$emit('update:isSettingsDrawerExpanded', !this.isSettingsDrawerExpanded);
		},
		onCssBreakpointChange(cssBreakpoint) {
			this.$emit('onCssBreakpointChange', cssBreakpoint);
			this.$emit('update:selectedCssBreakpointTitle', cssBreakpoint.title);

			if(sessionStorage && cssBreakpoint && cssBreakpoint.title)
			{
				sessionStorage.setItem("saveCssBreakpointTitle", cssBreakpoint.title);
			}

		},
		getSelectedCssBreakpoint(title) {
			return this.cssBreakpoints.filter(p => p.title === title)[0];
		},
	},
	created()
	{
		if(sessionStorage)
		{
			this.savedBreakpointTitle = sessionStorage.getItem("saveCssBreakpointTitle")
			this.saveStateTitle = sessionStorage.getItem("saveStateTitle");
		}
	},
	mounted()
	{
		if(this.savedBreakpointTitle !== null)
		{
			const savedBreakpoint = this.getSelectedCssBreakpoint(this.savedBreakpointTitle);
			this.onCssBreakpointChange(savedBreakpoint);
		}
		if(this.saveStateTitle && this.states)
		{
			let savedState = this.states.filter(x => x.Title == this.saveStateTitle)[0];
			if(!savedState)
			{
				savedState =  this.states[0];
				
			}
			if(savedState)
			{
				this.$emit('update:selectedStateTitle', savedState.Title);
			}
		}
	}
};
</script>

<style lang="less">
@import '../../styles/colors';

a.showcase__repo-link
{
		color:#fff;
		&:hover,
		&:focus,
		&:active
		{
			color:#fff;
		}
}

.demo-form-group__label
{
	border-bottom: 1px dotted #fff;
	margin-bottom: 0.5rem;
}

.showcase__settings-drawer {
		position: relative;
		z-index: 4;
		.row
		{
			display: flex;
			justify-content: space-between;
		}
	}

	.showcase__settings-drawer-toolbar {
		font-size:1.4rem;
		position: relative;
		padding: 1.75rem 2.5rem 1.5rem;
		background: @color--white;
		border: 1px solid @color--grey;
	}

	.showcase__settings-drawer-expanded {
		position: relative;
		color: @color--white;
		background: #494949;
		padding: 4rem;
	}

	.showcase__show-settings-drawer-button {
		position: relative;
		font-size:inherit;
		color: @color--blue;
		background: none;
		padding-left: 0;
		border: none;
		border-radius: 0;
		appearance: none;
		cursor: pointer;
		transition: transform 0.3s ease;
		padding-right: 1.4rem;
		text-decoration: none;

		&:after {
			display: block;
			position: absolute;
			right: -0.1rem;
			top: 0.5rem;
			width: 1rem;
			height: 1rem;
			content: '';
			pointer-events: none;
			background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMDkzZTgiIGQ9Ik01MDAsNjU4LjZMNjcuNywyMjYuMkwxMCwyODMuOGw0OTAsNDkwbDQ5MC00OTBsLTU3LjctNTcuN0w1MDAsNjU4LjZ6Ii8+PC9nPjwvc3ZnPg==);
			background-size: 100% auto;
		}

		&:focus {
			text-decoration: underline;
			outline: none;
		}

		label {
			display: block;
			margin-bottom: 1.25rem;
			cursor: pointer;

			input { margin-right: 0.5rem; }

			&:last-child { margin-bottom: 0; }
		}

		.showcase__wrapper--settings-drawer-is-open &:after { transform: scaleY(-1); }
	}

	.showcase__size-selector {
		transition: transform 0.3s ease;
		transform: translate3d(-50%, 0, 0);
		display: flex;
		height: 3rem;
		top:1.3rem;
		align-content: center;
		justify-content: center; 
		position: absolute;
		z-index: 2;
		//bottom: 1.65rem;
		left: 50%;
	}
	

	.showcase__size-selector-button {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: transform 0.3s ease, opacity 0.3s ease;
		
		text-align: center;
		cursor: pointer;
		color: @color--some-blue-why-is-this-not-consistent;
		//border: 2px solid @color--grey;
		margin: 0 0.4rem;
		padding:0 .5rem;

		svg {
			width: 2rem;
			height: auto;

			path { fill: currentColor; }
		}

		&:hover { color: darken(@color--some-blue-why-is-this-not-consistent, 15%); }

		&.showcase__size-selector-button--is-active
		{
			//background:@color--grey;
			color:#000;
			text-decoration: underline;
		}

		// &:after {
		//   transition: opacity 0.1s ease;
		//   display: block;
		//   content: '';
		//   position: absolute;
		//   bottom: -0.75rem;
		//   left: 50%;
		//   margin-left: -0.2rem;
		//   // width: 0.4rem;
		//   // height: 0.4rem;
		//   border-radius: 50%;
		//   background: @color--blue;
		//   opacity: 0;
		// }

		&--is-active:after { opacity: 1; }

		&--desktop svg {
			position: relative;
			top: 0.2rem;
		}
	}

	.showcase__render-state
	{
		float: right;
	}

	/*
 * _demo-radio-button.scss
 *
 */

	.demo-radio-button {
		display: flex;
		flex-direction: row;
		line-height: 1.95rem;

		.demo-form-group__label + & { margin-top: 1.5rem; }

		& + .demo-radio-button { margin-top: 1rem; }

		&--white {
			.demo-radio-button__label { color: @color--white; }

			&:not(.demo-radio-button--is-disabled) .demo-radio-button__label:hover div.demo-radio-button__custom-radio-button {
				border-color: @color--white;
			}

			.demo-radio-button__input:checked + .demo-radio-button__label .demo-radio-button__custom-radio-button {
				border-color: @color--white !important; // FML
			}

			.demo-radio-button__custom-radio-button:after { background: @color--white; }
		}
	}

	.demo-form-group--radio-button-toggle.demo-form-group { min-width: 16rem; }

	.demo-radio-button__label {
		display: flex;
		align-items: center;
		margin-bottom: 0;
		color: @demo-radio-button--color-text;
		letter-spacing: 0.075rem;
		cursor: pointer;

		.demo-radio-button--is-disabled & {
			color: lighten(@demo-radio-button--color-text, 40%);
			cursor: not-allowed;
		}
	}

	.demo-radio-button__custom-radio-button {
		position: relative;
		width: 1.6rem;
		height: 1.6rem;
		margin: -0.3rem 1.75rem 0 0;
		border-radius: 50%;
		border: 1px solid @demo-radio-button--color-grey;
		cursor: pointer;

		.demo-radio-button:not(.demo-radio-button--is-disabled) .demo-radio-button__label:hover & {
			border-color: @demo-radio-button--color-blue;
		}

		&:after {
			transition: opacity 100ms ease;
			display: block;
			content: '';
			position: absolute;
			top: 0.2rem;
			left: 0.2rem;
			width: 1rem;
			height: 1rem;
			border-radius: 50%;
			background: @demo-radio-button--color-blue;
			opacity: 0;
		}

		.demo-radio-button__input:checked + .demo-radio-button__label & {
			border-color: @demo-radio-button--color-blue;

			&:after { opacity: 1; }
		}
	}

</style>
