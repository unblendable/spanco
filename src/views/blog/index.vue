<template>
  <div class="app-container">
    <h3>Blog</h3>
    <img :src="API_URL+'/images/banner-blog.jpg'" style="width: 100%">
    
    <el-table
      :data="blogs"
      style="width: 100%">
      <el-table-column
        label="Title image"
        prop="title_img">
        <template slot-scope="scope">
          <el-avatar shape="square" :size="50" :src="scope.row.filepath"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="Title"
        prop="title">
      </el-table-column>
      <el-table-column
        label="Tag"
        prop="tag">
      </el-table-column>
      <el-table-column
        label="Upload date"
        prop="created_at">
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" >
        <el-button type="success" size="mini" @click="handleAdd" >
            <i class="el-icon-plus"></i>
        </el-button>
      </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleView(scope.$index, scope.row)"><i class="el-icon-view"></i></el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i></el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div align="center" style="padding-top: 30px">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-page="page"
        @current-change="onPageChange"
        :total="total"
        :page-size="5"
        >
      </el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogForm" width="80%">
        <el-form ref="form" :model="form" label-width="120px" label-position="top">
          <el-form-item label="Title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="Tag">
            <el-input v-model="form.tag"></el-input>
          </el-form-item>
          <el-form-item label="Title Image">
            <el-upload
              class="avatar-uploader"
              action="#"
              ref="file"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="onFileChange"
              accept="image/jpeg,image/png"
              >
              <img v-if="url" :src="url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="Detail">
            <wysiwyg  v-model="form.body" />
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogForm = false">Cancel</el-button>
        <el-button type="primary" @click="submitDialog">Confirm</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="''" :visible.sync="dialogView" width="80%">
      <div align="center" style="height: 350px; overflow: hidden">
        <img :src="url" width="100%">
      </div>
      <h3>{{ form.title }}</h3>
      <span v-html="form.body"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogView = false">Cancel</el-button>
        <el-button type="primary" @click="dialogView = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      API_URL: 'localhost',
      search: '',
      form: {
        title: null,
        tag: null,
        body: null
      },
      formLabelWidth: '120px',
      dialogForm: false,
      file: null,
      url: '',
      dialogTitle: '',
      editIndex: -1,
      dialogView: false,
      blogs: [],
      page: 1,
      total: 10
    }
  },
  created(){
    var url = window.location.href.split('://')
    url[1] = url[1].split('/').shift()
    url[1] = url[1].split(':').shift()
    this.API_URL = url.join('://')
  },
  async mounted(){
    this.getData()
  },
  methods: {
    async submitDialog(){
      this.dialogForm = false
      let msg = 'Success'
      let formdata = new FormData()
      formdata.append('title', this.form.title)
      formdata.append('tag', this.form.tag)
      formdata.append('body', this.form.body)

      var today = new Date()
      if(this.editIndex < 0){
        //ADD
        if(this.file) formdata.append('file', this.file)
        let result = await axios.post(this.API_URL+'/blog/add', formdata)
        if(result.data.data.insertId){
          this.blogs.push({
            id: result.data.data.insertId,
            filename: result.data.data.filename,
            filepath: this.API_URL+'/images/uploads/'+result.data.data.filename,
            title: this.form.title,
            tag: this.form.tag,
            body: this.form.body,
            created_at: today.toISOString().split('T')[0]
          })
        }
        msg = 'Add blog completed'
      }else{
        //EDIT
        formdata.append('id', this.blogs[this.editIndex].id)
        if(this.file) formdata.append('file', this.file)
        let result = await axios.post(this.API_URL+'/blog/update', formdata)
        if(result.data.data.affectedRows){
          this.blogs[this.editIndex].title = this.form.title
          this.blogs[this.editIndex].tag = this.form.tag
          this.blogs[this.editIndex].body = this.form.body
          if(this.file){
            var new_filename = this.file.name.split('.').join('-bl-'+today.getHours()+'.')
            this.blogs[this.editIndex].filename = new_filename
            this.blogs[this.editIndex].filepath = this.API_URL+'/images/uploads/'+new_filename
          }
          this.blogs[this.editIndex].created_at = today.toISOString().split('T')[0]
        }
        msg = 'Update blog completed'
      }
      this.$message({
          type: 'success',
          message: msg
        });
      this.dialogForm = false
    },
    handleView(index, item){
      this.dialogView = true
      this.url = item.filepath
      this.form.title = item.title
      this.form.body = item.body
    },
    handleAdd(){
      this.editIndex = -1
      this.url = null
      this.dialogTitle = "Add blog"
      this.dialogForm = true
      this.form = {
        title: null,
        body: null
      }
    },
    handleEdit(index, row) {
      this.editIndex = index
      this.dialogTitle = "Edit blog"
      this.dialogForm = true
      this.file = null
      this.url = row.filepath
      this.form = {
        title: row.title,
        body: row.body
      }
    },
    handleDelete(index, row) {
      this.$confirm('Delete ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.post(this.API_URL+'/blog/remove', row)
        this.blogs.splice(index, 1)
        this.$message({
          type: 'success',
          message: 'Delete completed'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        });          
      });
    },
    onFileChange(e) {
      this.$refs.file.clearFiles()
      this.file = e.raw;
      this.url = URL.createObjectURL(this.file);
    },
    async getData(){
      this.blogs = []
      let result = await axios.get(this.API_URL+'/blog/list?page='+this.page)
      for(let item of result.data.data){
        item.created_at = item.created_at.split('T')[0]
        item.filepath = this.API_URL+'/images/uploads/'+item.title_img
        this.blogs.push(item)
        this.total = item.total
      }
    },
    onPageChange(pageNum){
      this.page = pageNum
      this.getData()
    }
  },
}
</script>

<style>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 100%;
    height: 500px;
    display: block;
  }
</style>