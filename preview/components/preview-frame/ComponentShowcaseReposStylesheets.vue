<template>
  <div class="component_showcase_repos_stylesheets" v-if="repos">
    <div 
      v-for="repo in repos" 
      :data-repo-name="repo.Name" 
      :data-repo-id="'id-' + repo.RepoId">
        <link 
          v-for="stylesheet in repo.Stylesheets" 
          v-if="repo.Stylesheets" 
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
