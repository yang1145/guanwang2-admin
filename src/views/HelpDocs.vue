<template>
  <div class="help-docs">
    <div class="page-header">
      <h2 class="page-title">帮助文档</h2>
      <p class="page-desc">系统使用手册与操作指南</p>
    </div>

    <el-row :gutter="24">
      <!-- 左侧目录 -->
      <el-col :xs="24" :md="6">
        <el-card shadow="hover" class="toc-card">
          <div class="toc-title">
            <el-icon><Menu /></el-icon>
            <span>目录导航</span>
          </div>
          <el-menu
            :default-active="activeSection"
            class="toc-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="products">
              <el-icon><Box /></el-icon>
              <span>产品管理</span>
            </el-menu-item>
            <el-menu-item index="goods">
              <el-icon><Goods /></el-icon>
              <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="news">
              <el-icon><Document /></el-icon>
              <span>新闻发布</span>
            </el-menu-item>
            <el-menu-item index="users">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="contacts">
              <el-icon><ChatDotRound /></el-icon>
              <span>留言管理</span>
            </el-menu-item>
            <el-menu-item index="categories">
              <el-icon><Files /></el-icon>
              <span>分类管理</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>网站设置</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :md="18">
        <el-card shadow="hover" class="content-card">
          <!-- 产品管理 -->
          <div v-show="activeSection === 'products'" class="doc-section">
            <h3 class="section-title">
              <el-icon><Box /></el-icon>
              <span>产品管理</span>
            </h3>
            
            <div class="doc-block">
              <h4>添加产品</h4>
              <ol class="step-list">
                <li>进入"内容管理 → 产品管理"页面</li>
                <li>点击右上角"添加产品"按钮</li>
                <li>填写产品基本信息：
                  <ul>
                    <li><strong>产品名称</strong>：必填，建议简洁明了</li>
                    <li><strong>产品分类</strong>：选择已有的分类或先创建分类</li>
                    <li><strong>产品描述</strong>：详细介绍产品特点和功能</li>
                    <li><strong>产品图片</strong>：支持 JPG/PNG 格式，建议尺寸 800x600</li>
                  </ul>
                </li>
                <li>点击"确定"保存产品</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>编辑产品</h4>
              <ol class="step-list">
                <li>在产品列表中找到需要编辑的产品</li>
                <li>点击操作列的"编辑"按钮</li>
                <li>修改相关信息后点击"确定"保存</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>删除产品</h4>
              <p>点击产品操作列的"删除"按钮，确认后产品将被永久删除。此操作不可恢复，请谨慎操作。</p>
            </div>
          </div>

          <!-- 商品管理 -->
          <div v-show="activeSection === 'goods'" class="doc-section">
            <h3 class="section-title">
              <el-icon><Goods /></el-icon>
              <span>商品管理</span>
            </h3>
            
            <div class="doc-block">
              <h4>商品上架</h4>
              <ol class="step-list">
                <li>进入"内容管理 → 商品管理"页面</li>
                <li>点击"添加商品"按钮</li>
                <li>填写商品信息：
                  <ul>
                    <li><strong>商品名称</strong>：必填项</li>
                    <li><strong>商品价格</strong>：设置销售价格</li>
                    <li><strong>库存数量</strong>：设置可售库存</li>
                    <li><strong>商品状态</strong>：上架/下架</li>
                  </ul>
                </li>
                <li>点击"确定"完成上架</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>库存管理</h4>
              <p>在商品列表中可直接编辑库存数量。当库存为 0 时，商品将自动显示为"缺货"状态。</p>
            </div>
          </div>

          <!-- 新闻发布 -->
          <div v-show="activeSection === 'news'" class="doc-section">
            <h3 class="section-title">
              <el-icon><Document /></el-icon>
              <span>新闻发布</span>
            </h3>
            
            <div class="doc-block">
              <h4>发布新闻</h4>
              <ol class="step-list">
                <li>进入"内容管理 → 新闻管理"页面</li>
                <li>点击"发布新闻"按钮</li>
                <li>填写新闻内容：
                  <ul>
                    <li><strong>标题</strong>：新闻标题，建议控制在 50 字以内</li>
                    <li><strong>分类</strong>：选择新闻所属分类</li>
                    <li><strong>摘要</strong>：简要概述新闻内容</li>
                    <li><strong>正文</strong>：详细的新闻内容</li>
                    <li><strong>封面图</strong>：可选，用于列表展示</li>
                  </ul>
                </li>
                <li>点击"发布"立即发布，或"保存草稿"稍后发布</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>新闻分类</h4>
              <p>新闻分类需要在"分类管理"中单独创建。创建分类时选择类型为"新闻"即可。</p>
            </div>
          </div>

          <!-- 用户管理 -->
          <div v-show="activeSection === 'users'" class="doc-section">
            <h3 class="section-title">
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </h3>
            
            <div class="doc-block">
              <h4>添加用户</h4>
              <ol class="step-list">
                <li>进入"系统管理 → 用户管理"页面</li>
                <li>点击"添加用户"按钮</li>
                <li>填写用户信息：
                  <ul>
                    <li><strong>用户名</strong>：登录账号，创建后不可修改</li>
                    <li><strong>密码</strong>：初始密码，建议用户首次登录后修改</li>
                    <li><strong>角色</strong>：管理员/编辑/访客</li>
                  </ul>
                </li>
                <li>点击"确定"创建用户</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>角色权限说明</h4>
              <el-table :data="rolePermissions" border size="small">
                <el-table-column prop="action" label="操作" width="200" />
                <el-table-column prop="admin" label="管理员" width="100" />
                <el-table-column prop="editor" label="编辑" width="100" />
                <el-table-column prop="guest" label="访客" width="100" />
              </el-table>
            </div>

            <div class="doc-block">
              <h4>禁用/启用账号</h4>
              <p>在用户列表中找到目标用户，点击"禁用"按钮可暂时停用该账号。禁用后用户无法登录系统，但数据会保留。点击"启用"可恢复账号使用。</p>
            </div>
          </div>

          <!-- 留言管理 -->
          <div v-show="activeSection === 'contacts'" class="doc-section">
            <h3 class="section-title">
              <el-icon><ChatDotRound /></el-icon>
              <span>留言管理</span>
            </h3>
            
            <div class="doc-block">
              <h4>查看留言</h4>
              <p>进入"内容管理 → 联系信息"页面，可看到所有访客提交的留言。留言按时间倒序排列，未读留言会有明显标识。</p>
            </div>

            <div class="doc-block">
              <h4>处理留言</h4>
              <ol class="step-list">
                <li>点击留言条目查看详情</li>
                <li>可标记为"已读"或"已回复"</li>
                <li>如需删除，点击"删除"按钮并确认</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>批量操作</h4>
              <p>勾选多条留言后，可批量标记为已读或批量删除。此功能适合处理大量留言时提高效率。</p>
            </div>
          </div>

          <!-- 分类管理 -->
          <div v-show="activeSection === 'categories'" class="doc-section">
            <h3 class="section-title">
              <el-icon><Files /></el-icon>
              <span>分类管理</span>
            </h3>
            
            <div class="doc-block">
              <h4>创建分类</h4>
              <ol class="step-list">
                <li>进入"内容管理 → 分类管理"页面</li>
                <li>点击"添加分类"按钮</li>
                <li>填写分类信息：
                  <ul>
                    <li><strong>分类名称</strong>：必填</li>
                    <li><strong>分类类型</strong>：产品/新闻/商品</li>
                    <li><strong>父级分类</strong>：可选，用于创建层级结构</li>
                    <li><strong>排序</strong>：数字越小越靠前</li>
                  </ul>
                </li>
                <li>点击"确定"保存分类</li>
              </ol>
            </div>

            <div class="doc-block">
              <h4>层级结构</h4>
              <p>支持两级分类结构。创建子分类时，在"父级分类"中选择对应的上级分类即可。例如：产品 → 电子产品 → 手机。</p>
            </div>

            <div class="doc-block">
              <h4>注意事项</h4>
              <el-alert
                title="删除分类前，请确保该分类下没有关联的产品/新闻/商品，否则删除会失败。"
                type="warning"
                :closable="false"
                show-icon
              />
            </div>
          </div>

          <!-- 网站设置 -->
          <div v-show="activeSection === 'settings'" class="doc-section">
            <h3 class="section-title">
              <el-icon><Setting /></el-icon>
              <span>网站设置</span>
            </h3>
            
            <div class="doc-block">
              <h4>基础配置</h4>
              <p>进入"系统管理 → 网站设置"页面，可配置以下信息：</p>
              <ul class="info-list">
                <li><strong>站点信息</strong>：网站标题、URL、公司名称</li>
                <li><strong>备案信息</strong>：ICP 备案号、公安备案号</li>
                <li><strong>联系方式</strong>：电话、邮箱、地址</li>
                <li><strong>社交媒体</strong>：微信公众号、微博等链接</li>
              </ul>
            </div>

            <div class="doc-block">
              <h4>SEO 设置</h4>
              <ul class="info-list">
                <li><strong>Meta 标题</strong>：搜索引擎显示的标题</li>
                <li><strong>Meta 描述</strong>：搜索引擎显示的描述</li>
                <li><strong>Meta 关键词</strong>：用逗号分隔的关键词</li>
              </ul>
            </div>

            <div class="doc-block">
              <h4>Logo 上传</h4>
              <p>支持上传 PNG/SVG 格式的 Logo。建议尺寸：宽度 200px，高度 60px。上传后会自动生成 favicon。</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Menu, Box, Goods, Document, User, ChatDotRound, Files, Setting 
} from '@element-plus/icons-vue'

const route = useRoute()
const activeSection = ref(route.query.section || 'products')

const handleMenuSelect = (index) => {
  activeSection.value = index
}

// 角色权限表格数据
const rolePermissions = [
  { action: '查看数据', admin: '✓', editor: '✓', guest: '✓' },
  { action: '添加/编辑内容', admin: '✓', editor: '✓', guest: '—' },
  { action: '删除内容', admin: '✓', editor: '—', guest: '—' },
  { action: '用户管理', admin: '✓', editor: '—', guest: '—' },
  { action: '系统设置', admin: '✓', editor: '—', guest: '—' }
]
</script>

<style scoped>
.help-docs {
  padding: 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.toc-card {
  position: sticky;
  top: 24px;
}

.toc-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-lighter);
}

.toc-menu {
  border-right: none;
}

.toc-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 4px 0;
  border-radius: 6px;
}

.toc-menu :deep(.el-menu-item.is-active) {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
  font-weight: 500;
}

.content-card {
  min-height: 600px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--primary-color);
}

.doc-block {
  margin-bottom: 28px;
}

.doc-block h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 3px solid var(--primary-color);
}

.doc-block p {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 12px;
}

.step-list {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 2;
  padding-left: 20px;
}

.step-list li {
  margin-bottom: 8px;
}

.step-list ul {
  margin-top: 8px;
  padding-left: 20px;
}

.step-list ul li {
  margin-bottom: 4px;
}

.info-list {
  font-size: 14px;
  color: var(--text-regular);
  line-height: 2;
  padding-left: 20px;
}

.info-list li {
  margin-bottom: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .toc-card {
    position: static;
    margin-bottom: 24px;
  }
  
  .toc-menu :deep(.el-menu-item) {
    display: inline-block;
    width: auto;
    margin: 4px;
  }
}
</style>
