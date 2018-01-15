<template>
  <div class="component_showcase_repos_stylesheets" v-if="repos">
    <div 
      v-for="repo in repos" 
      :key="repo.RepoId" 
      :data-repo-name="repo.Name" 
      :data-repo-id="'id-' + repo.RepoId">
        <link 
          v-for="(stylesheet, index) in repo.Stylesheets" 
          v-if="repo.Stylesheets" 
          :key="repo.RepoId + index" 
          :href="stylesheet"
          rel="stylesheet" 
          type="text/css" 
          disabled 
          data-previewcss/>
    </div>
  </div>
</template>

<script>
module.exports =  {
  name: 'component-showcase-repos-stylesheets',
  props: ["repos"],
  mounted:() => {
  }
};
</script>
