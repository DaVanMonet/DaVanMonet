<template>
    <div class="showcase__render-iframe-wrapper">
        <iframe ref="iframe" class="showcase__render-iframe" :src="public_path + '/showcase-render-iframe.html'" scrolling="no" :data-repo-name="repo.Name" :data-repo-id="'id-'+ repo.RepoId"></iframe>
    </div>
</template>

<script>
import { iframeResizer } from 'iframe-resizer'

export default
{
    name: 'component-showcase-render',
    props: [
		'stateData',
		'renderSource',
		'requirejs',
		'iframeContentHeight',
		'repo'
    ],
    methods:
    {
        onIframeLoad()
        {
            var parser = document.createElement('a');
            parser.href = window.location.href;

            this.$refs.iframe.src = this.$refs.iframe.src + "#" + parser.pathname;
            
            this.populateIframeWithRenderSource();
            if (this.renderSource)
            {
                this.$root.iframeResizer = iframeResizer(
                {
                    log: false
                }, 'iframe');

                var iframeWin = this.$refs.iframe.contentWindow;

                this.$parent.$emit('register-iframe', this.$refs.iframe);

                iframeWin.addEventListener('resize', () =>
                {
                    this.$refs.iframe.iFrameResizer.resize();
                    this.$parent.setHeight(this.$refs.iframe.clientHeight)
                });
            }
        },

        populateIframeWithRenderSource()
        {
            if(this.renderSource)
            {
                const renderElm = this.$refs.iframe.contentDocument.body.querySelector('.showcase__render');
                if(renderElm)
                {
                    if(this.stateData.Language === "html" || this.stateData.Language === "angular")
                    {
                        // We only use innerHTML if we use actual markup.
                        renderElm.innerHTML = this.renderSource;
                    }
                    else
                    {
                        // We use the DOM parser with XML to make sure we keep the letter casing
                        const parser = new window.DOMParser();
                        const contentRoot = '<root>'+ this.renderSource +'</root>';
                        const parsedSource = parser.parseFromString(contentRoot, "text/xml");                
                        if(parsedSource.documentElement && parsedSource.documentElement.children.length > 0)
                        {
                            for (var child of parsedSource.documentElement.children)
                            {
                                renderElm.append(child);
                            }
                        }
                    }
                    
                    renderElm.setAttribute('data-hascontent',true);
                    this.$refs.iframe.contentWindow.postMessage('render-' + this.stateData.Language,window.location.origin)
                }
                else
                {
                    console.error('Unable to insert preview markup into iframe')
                }
            }
        }

    },

    computed:
    {
        public_path() {
            let path = this.$root.projectconfig.directories.public_path;
            if (path === '/')
                path = '';
            return path;
        }
    },

    mounted()
    {
        this.$refs.iframe.addEventListener('load', this.onIframeLoad);
    },

    beforeDestroy()
    {
        this.$root.iframeResizer = null;
        this.$refs.iframe.removeEventListener('load', this.onIframeLoad);
    },

};

</script>

<style lang="less">
@import '../../styles/colors';

.showcase__render-iframe-wrapper {
    position: relative;
    z-index: 2;
}

.showcase__render-wrapper,
.showcase__render-resizeable {
    position: relative;
    margin: 0 auto;
    line-height: 0;
}

.showcase__render-wrapper {
    overflow: hidden;
}

.showcase__render-iframe {
    position: relative;
    z-index: 2;
    width: 100%;
    border: none;
}

.showcase__render {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rem 2.5rem;

    &--buttons {
        flex-direction: row;

        * {
            margin-right: 2.5%;

            &:last-child {
                margin-right: 0;
            }
        }
    }

    &--checkboxes,
    &--radio-buttons {
        flex-direction: column;
    }

    &--checkboxes * {
        margin-bottom: 1.25rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.showcase__render-iframe-wrapper {}

</style>
