const App = {
data: {
    projects: [],
    customers: [],
    deposits: [],
    tasks: [],
    currentPage: 'dashboard',
  searchQuery: '',
  filterStatus: '',
  filterStage: '',
  projectTab: 'recent',
  options: {
    stages: [
      { value: 'pre', label: '贷前调查' },
      { value: 'mid', label: '贷中审批' },
      { value: 'post', label: '贷后管理' }
    ],
    statuses: [
      { value: 'pending', label: '待处理' },
      { value: 'processing', label: '审批中' },
      { value: 'completed', label: '已完成' },
      { value: 'rejected', label: '已拒绝' }
    ],
    terms: [
      { value: '3', label: '3个月' },
      { value: '6', label: '6个月' },
      { value: '12', label: '12个月' },
      { value: '24', label: '24个月' },
      { value: '36', label: '36个月' }
    ],
    guaranteeTypes: [
      { value: 'credit', label: '信用贷款' },
      { value: 'mortgage', label: '抵押贷款' },
      { value: 'pledge', label: '质押贷款' },
      { value: 'guarantee', label: '担保贷款' }
    ],
    urgencies: [
      { value: 'normal', label: '普通' },
      { value: 'urgent', label: '紧急' },
      { value: 'very_urgent', label: '非常紧急' }
    ]
  }
},

init() {
  if (!this.checkLogin()) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;"><h2>请先登录</h2><p>密码错误或已超时</p></div>';
    return;
  }
  this.loadData();
  this.initOptionDropdowns();
  this.bindEvents();
  this.render();
},

loadData() {
  const stored = localStorage.getItem('creditProjects');
  if (stored) {
    this.data.projects = JSON.parse(stored);
  } else {
    this.data.projects = this.generateSampleData();
    this.saveData();
  }
  const custStored = localStorage.getItem('creditCustomers');
  if (custStored) {
    this.data.customers = JSON.parse(custStored);
  } else {
    this.data.customers = this.generateSampleCustomers();
    this.saveData();
  }
  const depStored = localStorage.getItem('creditDeposits');
  if (depStored) {
    this.data.deposits = JSON.parse(depStored);
  } else {
    this.data.deposits = this.generateSampleDeposits();
    this.saveData();
  }
  const taskStored = localStorage.getItem('creditTasks');
  if (taskStored) {
    this.data.tasks = JSON.parse(taskStored);
  } else {
    this.data.tasks = this.generateSampleTasks();
    this.saveData();
  }
  const optStored = localStorage.getItem('creditOptions');
  if (optStored) {
    this.data.options = JSON.parse(optStored);
  } else {
    this.saveOptions();
  }
},

saveData() {
    localStorage.setItem('creditProjects', JSON.stringify(this.data.projects));
    localStorage.setItem('creditCustomers', JSON.stringify(this.data.customers));
    localStorage.setItem('creditDeposits', JSON.stringify(this.data.deposits));
    localStorage.setItem('creditTasks', JSON.stringify(this.data.tasks));
  },

saveOptions() {
  localStorage.setItem('creditOptions', JSON.stringify(this.data.options));
},

initOptionDropdowns() {
  const creditTerm = document.getElementById('creditTerm');
  if (creditTerm) {
    creditTerm.innerHTML = this.data.options.terms.map(t => `<option value="${t.value}">${t.label}</option>`).join('');
  }
  const guaranteeType = document.getElementById('guaranteeType');
  if (guaranteeType) {
    guaranteeType.innerHTML = this.data.options.guaranteeTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('');
  }
  const urgency = document.getElementById('urgency');
  if (urgency) {
    urgency.innerHTML = this.data.options.urgencies.map(u => `<option value="${u.value}">${u.label}</option>`).join('');
  }
  const editStage = document.getElementById('editStage');
  if (editStage) {
    editStage.innerHTML = this.data.options.stages.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
  }
  const editStatus = document.getElementById('editStatus');
  if (editStatus) {
    editStatus.innerHTML = this.data.options.statuses.map(s => `<option value="${s.value}">${s.label}</option>`).join('');
  }
},

generateSampleCustomers() {
  return [
    { customerNo: '20260001', name: '北京创新科技有限公司', accounts: ['6222021100012345678', '6222021100012345679'], type: 'enterprise', contact: '张总', phone: '13800138000', address: '北京市朝阳区' },
    { customerNo: '20260002', name: '上海国际贸易集团', accounts: ['6222021100012345680'], type: 'enterprise', contact: '李经理', phone: '13800138001', address: '上海市浦东新区' },
    { customerNo: '20260003', name: '深圳智能制造企业', accounts: ['6222021100012345681', '6222021100012345682'], type: 'enterprise', contact: '王总', phone: '13800138002', address: '深圳市南山区' },
    { customerNo: '20260004', name: '广州物流运输公司', accounts: ['6222021100012345683'], type: 'enterprise', contact: '刘总', phone: '13800138003', address: '广州市天河区' },
    { customerNo: '20260005', name: '杭州电子商务', accounts: ['6222021100012345684', '6222021100012345685'], type: 'enterprise', contact: '陈总', phone: '13800138004', address: '杭州市滨江区' },
    { customerNo: '20260006', name: '张三', accounts: ['6222021100012345686'], type: 'personal', phone: '13900139000' },
    { customerNo: '20260007', name: '李四', accounts: ['6222021100012345687', '6222021100012345688'], type: 'personal', phone: '13900139001' }
  ];
},

generateSampleDeposits() {
  return [
    { id: 'D001', customerId: '20260001', customerName: '北京创新科技有限公司', amount: 5000000, type: '定期', productName: '定期存款A', date: '2025-01-15', rate: 2.1, ftpRate: 1.5, maturityDate: '2026-01-15' },
    { id: 'D002', customerId: '20260002', customerName: '上海国际贸易集团', amount: 8000000, type: '活期', productName: '活期账户', date: '2025-02-20', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
    { id: 'D003', customerId: '20260003', customerName: '深圳智能制造企业', amount: 3000000, type: '定期', productName: '定期存款B', date: '2025-03-10', rate: 2.25, ftpRate: 1.6, maturityDate: '2026-03-10' },
    { id: 'D004', customerId: '20260004', customerName: '广州物流运输公司', amount: 2000000, type: '活期', productName: '活期账户', date: '2025-03-25', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
    { id: 'D005', customerId: '20260005', customerName: '杭州电子商务', amount: 6000000, type: '定期', productName: '定期存款A', date: '2025-04-05', rate: 2.15, ftpRate: 1.5, maturityDate: '2026-04-05' },
    { id: 'D006', customerId: '20260001', customerName: '北京创新科技有限公司', amount: 1500000, type: '活期', productName: '活期账户', date: '2025-04-18', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
    { id: 'D007', customerId: '20260006', customerName: '张三', amount: 500000, type: '定期', productName: '定期存款B', date: '2025-05-01', rate: 2.3, ftpRate: 1.65, maturityDate: '2026-05-01' },
{ id: 'D008', customerId: '20260007', customerName: '李四', amount: 300000, type: '活期', productName: '活期账户', date: '2025-05-10', rate: 0.35, ftpRate: 0.2, maturityDate: '' }
  ];
},

generateSampleTasks() {
  const today = new Date();
  return [
    { id: 'T001', title: '客户尽职调查', customerNo: '20260001', dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T002', title: '资料收集与核实', customerNo: '20260001', dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T003', title: '信用评估报告', customerNo: '20260002', dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T004', title: '实地考察', customerNo: '20260003', dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T005', title: '初审评估', customerNo: '20260002', dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: true },
    { id: 'T006', title: '合同签订', customerNo: '20260004', dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T007', title: '首次检查', customerNo: '20260005', dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false },
    { id: 'T008', title: '定期检查', customerNo: '20260001', dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: false }
  ];
},

generateSampleData() {
      const customers = ['北京创新科技有限公司', '上海国际贸易集团', '深圳智能制造企业', '广州物流运输公司', '杭州电子商务', '成都软件开发', '武汉新能源科技', '南京制造业', '西安高新材料', '重庆文化旅游'];
      const statuses = ['pending', 'processing', 'completed', 'rejected'];
      const stages = ['pre', 'mid', 'post'];
      const urgencies = ['normal', 'urgent', 'very_urgent'];
      const projects = [];

      for (let i = 0; i < 15; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const stage = status === 'completed' ? 'post' : stages[Math.floor(Math.random() * 3)];
        const amount = Math.floor(Math.random() * 10000000) + 500000;
        const createdAt = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);

        projects.push({
          id: `PRJ${String(2026001 + i).padStart(6, '0')}`,
          name: `授信项目-${customers[i % customers.length]}`,
          customerName: customers[i % customers.length],
          customerType: i % 2 === 0 ? 'enterprise' : 'personal',
          amount: amount,
          term: [6, 12, 24, 36][Math.floor(Math.random() * 4)],
          rate: (Math.random() * 3 + 3.5).toFixed(2),
          guaranteeType: ['credit', 'mortgage', 'pledge', 'guarantee'][Math.floor(Math.random() * 4)],
          status: status,
          stage: stage,
          urgency: urgencies[Math.floor(Math.random() * 3)],
          stageProgress: { pre: 0, mid: 0, post: 0 },
          remark: '',
          createdAt: createdAt.toISOString(),
          endDate: status === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
          drawDate: stage === 'mid' || stage === 'post' ? new Date(createdAt.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
          postLoanTaskDates: this.generatePostLoanTaskDates(),
          tasks: this.generateTasks(status, stage)
        });

        const project = projects[projects.length - 1];
        if (stage === 'pre') project.stageProgress.pre = Math.floor(Math.random() * 100);
        else if (stage === 'mid') { project.stageProgress.pre = 100; project.stageProgress.mid = Math.floor(Math.random() * 100); }
        else { project.stageProgress.pre = 100; project.stageProgress.mid = 100; project.stageProgress.post = Math.floor(Math.random() * 100); }
      }

      return projects;
    },

    generatePostLoanTaskDates() {
      const baseDate = new Date();
      return [
        new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      ];
    },

      generateTasks(status, stage) {
        const preTasks = [
          { id: 1, title: '客户尽职调查', completed: false },
          { id: 2, title: '资料收集与核实', completed: false },
          { id: 3, title: '信用评估报告', completed: false },
          { id: 4, title: '实地考察', completed: false }
        ];
        const midTasks = [
          { id: 5, title: '初审评估', completed: false },
          { id: 6, title: '复审评估', completed: false },
          { id: 7, title: '终审决策', completed: false },
          { id: 8, title: '合同签订', completed: false }
        ];
        const postTasks = [
          { id: 9, title: '首次检查', completed: false },
          { id: 10, title: '定期检查', completed: false },
          { id: 11, title: '风险评估', completed: false },
          { id: 12, title: '到期处理', completed: false }
        ];

        let tasks = [];
        if (stage === 'pre' || status === 'pending') tasks = preTasks;
        else if (stage === 'mid' || status === 'processing') tasks = [...preTasks, ...midTasks];
        else tasks = [...preTasks, ...midTasks, ...postTasks];

        if (status === 'completed') {
          tasks.forEach(t => t.completed = true);
        }

        return tasks;
      },

      bindEvents() {
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
          document.getElementById('sidebar').classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
          link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            this.data.currentPage = link.dataset.page;
            document.getElementById('sidebar').classList.remove('open');
            this.render();
          });
        });

        document.getElementById('newProjectBtn').addEventListener('click', () => {
          this.openProjectModal();
        });

        document.getElementById('modalClose').addEventListener('click', () => {
          this.closeModal('projectModal');
        });

        document.getElementById('detailModalClose').addEventListener('click', () => {
          this.closeModal('detailModal');
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
          this.closeModal('projectModal');
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
          this.saveProject();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
          this.data.searchQuery = e.target.value;
          this.render();
        });
      },

openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');

    this.currentSelectedCustomers = project ? [...(project.customerIds || [])] : [];

    if (project) {
      document.getElementById('modalTitle').textContent = '编辑项目';
      document.getElementById('projectCode').value = project.id;
      document.getElementById('projectName').value = project.name;
      document.getElementById('creditAmount').value = project.amount;
      document.getElementById('creditTerm').value = project.term;
      document.getElementById('interestRate').value = project.rate;
      document.getElementById('guaranteeType').value = project.guaranteeType;
      document.getElementById('startDate').value = project.createdAt ? project.createdAt.split('T')[0] : '';
      document.getElementById('endDate').value = project.endDate ? project.endDate.split('T')[0] : '';
      document.getElementById('remark').value = project.remark || '';
      document.getElementById('urgency').value = project.urgency || 'normal';
      document.getElementById('editStage').value = project.stage || 'pre';
      document.getElementById('editStatus').value = project.status || 'pending';
      document.getElementById('drawDate').value = project.drawDate || '';
      const taskDates = project.postLoanTaskDates || [];
      for (let i = 1; i <= 4; i++) {
        const input = document.getElementById('postLoanTaskDate' + i);
        if (input) input.value = taskDates[i - 1] || '';
      }
      this.renderCustomerList();
      this.updateSelectedCustomers(this.currentSelectedCustomers);
    } else {
      document.getElementById('modalTitle').textContent = '新建项目';
      form.reset();
      document.getElementById('projectCode').value = this.generateProjectCode();
      document.getElementById('urgency').value = 'normal';
      document.getElementById('editStage').value = 'pre';
      document.getElementById('editStatus').value = 'pending';
      this.currentCustomerFilter = '';
      this.renderCustomerList();
      this.updateSelectedCustomers([]);
    }

    modal.classList.add('active');
  },

      currentCustomerFilter: '',
      currentSelectedCustomers: [],

renderCustomerList() {
  const container = document.getElementById('customerList');
  const filter = (this.currentCustomerFilter || '').toLowerCase();
  const filtered = this.data.customers.filter(c =>
    c.name.toLowerCase().includes(filter) || (c.contact || '').toLowerCase().includes(filter)
  );
  container.innerHTML = filtered.map(c => `
  <div style="display:flex;align-items:center;gap:8px;padding:6px;border-bottom:1px solid var(--border);cursor:pointer;" onclick="App.toggleCustomer('${c.customerNo}')">
  <input type="checkbox" ${this.currentSelectedCustomers.includes(c.customerNo) ? 'checked' : ''} onclick="event.stopPropagation();App.toggleCustomer('${c.customerNo}')">
  <div>
    <div style="font-weight:500;">${c.name}</div>
    <div style="font-size:12px;color:var(--text-light);">${c.type === 'enterprise' ? '企业' : '个人'} · ${c.phone || ''}</div>
  </div>
  </div>
  `).join('');
},

      filterCustomers(value) {
        this.currentCustomerFilter = value;
        this.renderCustomerList();
      },

depositCustomerFilter: '',

      filterDepositCustomers(value) {
        this.depositCustomerFilter = value;
        this.renderDepositCustomerList();
      },

      currentDepositSelectedCustomer: [],

      renderDepositCustomerList() {
        const container = document.getElementById('depositCustomerList');
        if (!container) return;
        const filter = (this.depositCustomerFilter || '').toLowerCase();
        const filtered = this.data.customers.filter(c =>
          c.name.toLowerCase().includes(filter) || (c.contact || '').toLowerCase().includes(filter)
        );
        container.innerHTML = filtered.map(c => `
        <div style="display:flex;align-items:center;gap:8px;padding:6px;border-bottom:1px solid var(--border);cursor:pointer;" onclick="App.toggleDepositCustomer('${c.customerNo}')">
        <input type="checkbox" ${this.currentDepositSelectedCustomer.includes(c.customerNo) ? 'checked' : ''} onclick="event.stopPropagation();App.toggleDepositCustomer('${c.customerNo}')">
        <div>
          <div style="font-weight:500;">${c.name}</div>
          <div style="font-size:12px;color:var(--text-light);">${c.type === 'enterprise' ? '企业' : '个人'} · ${c.phone || ''}</div>
        </div>
        </div>
        `).join('');
      },

      toggleDepositCustomer(customerId) {
        const idx = this.currentDepositSelectedCustomer.indexOf(customerId);
        if (idx >= 0) {
          this.currentDepositSelectedCustomer.splice(idx, 1);
        } else {
          this.currentDepositSelectedCustomer = [customerId];
        }
        this.renderDepositCustomerList();
        this.updateDepositSelectedCustomers();
      },

      updateDepositSelectedCustomers() {
        const container = document.getElementById('depositSelectedCustomers');
        if (!container) return;
        const customers = this.data.customers.filter(c => this.currentDepositSelectedCustomer.includes(c.customerNo));
        container.innerHTML = customers.map(c => `
        <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 8px;background:var(--primary);color:white;border-radius:4px;font-size:12px;">
        ${c.name}
        <span style="cursor:pointer;" onclick="App.removeDepositCustomer('${c.customerNo}')">✕</span>
        </span>
        `).join('') || '<span style="color:var(--text-lighter);font-size:12px;">请从上方选择客户</span>';
      },

      removeDepositCustomer(customerId) {
        const idx = this.currentDepositSelectedCustomer.indexOf(customerId);
        if (idx >= 0) {
          this.currentDepositSelectedCustomer.splice(idx, 1);
          this.renderDepositCustomerList();
          this.updateDepositSelectedCustomers();
        }
      },

toggleCustomer(customerId) {
    const idx = this.currentSelectedCustomers.indexOf(customerId);
    if (idx >= 0) {
      this.currentSelectedCustomers.splice(idx, 1);
    } else {
      this.currentSelectedCustomers.push(customerId);
    }
    this.renderCustomerList();
    this.updateSelectedCustomers(this.currentSelectedCustomers);
  },

  togglePostLoanTaskDates() {
    const type = document.querySelector('input[name="postLoanTaskType"]:checked').value;
    const container = document.getElementById('postLoanTaskDatesContainer');
    if (type === 'custom') {
      container.style.display = 'flex';
    } else {
      container.style.display = 'none';
      const baseDate = new Date();
      let dates = [];
      if (type === 'quarterly') {
        for (let i = 1; i <= 4; i++) {
          dates.push(new Date(baseDate.getTime() + i * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        }
      } else {
        for (let i = 1; i <= 2; i++) {
          dates.push(new Date(baseDate.getTime() + i * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
        }
      }
      for (let i = 1; i <= 4; i++) {
        const input = document.getElementById('postLoanTaskDate' + i);
        if (input) input.value = dates[i - 1] || '';
      }
    }
  },

updateSelectedCustomers(selectedIds) {
  const container = document.getElementById('selectedCustomers');
  const customers = this.data.customers.filter(c => selectedIds.includes(c.customerNo));
  container.innerHTML = customers.map(c => `
  <span style="display:inline-flex;align-items:center;gap:4px;padding:4px 8px;background:var(--primary);color:white;border-radius:4px;font-size:12px;">
  ${c.name}
  <span style="cursor:pointer;" onclick="App.removeCustomer('${c.customerNo}')">✕</span>
  </span>
  `).join('') || '<span style="color:var(--text-lighter);font-size:12px;">请从上方选择客户</span>';
},

      removeCustomer(customerId) {
        const idx = this.currentSelectedCustomers.indexOf(customerId);
        if (idx >= 0) {
          this.currentSelectedCustomers.splice(idx, 1);
          this.renderCustomerList();
          this.updateSelectedCustomers(this.currentSelectedCustomers);
        }
      },

      generateProjectCode() {
        const maxNum = this.data.projects.reduce((max, p) => {
          const num = parseInt(p.id.replace('PRJ', ''));
          return num > max ? num : max;
        }, 2026000);
        return `PRJ${String(maxNum + 1).padStart(6, '0')}`;
      },

      closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
      },

saveProject() {
    const projectCode = document.getElementById('projectCode').value;
    const projectName = document.getElementById('projectName').value;
    const customerIds = this.currentSelectedCustomers || [];
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const term = parseInt(document.getElementById('creditTerm').value);
    const rate = document.getElementById('interestRate').value;
    const guaranteeType = document.getElementById('guaranteeType').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const remark = document.getElementById('remark').value;
    const urgency = document.getElementById('urgency').value;
    const editStage = document.getElementById('editStage').value;
    const editStatus = document.getElementById('editStatus').value;
    const drawDate = document.getElementById('drawDate').value;
    const postLoanTaskDates = [
      document.getElementById('postLoanTaskDate1').value,
      document.getElementById('postLoanTaskDate2').value,
      document.getElementById('postLoanTaskDate3').value,
      document.getElementById('postLoanTaskDate4').value
    ].filter(d => d);

    if (!projectName || customerIds.length === 0 || !amount) {
      alert('请填写必填字段');
      return;
    }

    const customerNames = this.data.customers.filter(c => customerIds.includes(c.customerNo)).map(c => c.name);
    const existingIndex = this.data.projects.findIndex(p => p.id === projectCode);

    const projectData = {
      id: projectCode,
      name: projectName,
      customerIds: customerIds,
      customerNames: customerNames,
      amount: amount,
      term: term,
      rate: rate,
      guaranteeType: guaranteeType,
      status: editStatus,
      stage: editStage,
      urgency: urgency,
      stageProgress: existingIndex >= 0 ? this.data.projects[existingIndex].stageProgress : { pre: 0, mid: 0, post: 0 },
      remark: remark,
      createdAt: startDate ? new Date(startDate).toISOString() : (existingIndex >= 0 ? this.data.projects[existingIndex].createdAt : new Date().toISOString()),
      endDate: endDate ? new Date(endDate).toISOString() : null,
      drawDate: drawDate,
      postLoanTaskDates: postLoanTaskDates,
      tasks: existingIndex >= 0 ? this.data.projects[existingIndex].tasks : this.generateTasks('pending', 'pre')
    };

    if (existingIndex >= 0) {
      this.data.projects[existingIndex] = projectData;
    } else {
      this.data.projects.unshift(projectData);
    }

    this.saveData();
    this.closeModal('projectModal');
    this.render();
  },

      getFilteredProjects() {
        let projects = this.data.projects;

        if (this.data.searchQuery) {
          const query = this.data.searchQuery.toLowerCase();
          projects = projects.filter(p =>
            p.name.toLowerCase().includes(query) ||
            (p.customerNames || []).some(n => n.toLowerCase().includes(query))
          );
        }

        if (this.data.filterStatus) {
          projects = projects.filter(p => p.status === this.data.filterStatus);
        }

        if (this.data.filterStage) {
          projects = projects.filter(p => p.stage === this.data.filterStage);
        }

        return projects;
      },

getStats() {
  const projects = this.data.projects;
  const total = projects.length;
  const stats = { total, totalAmount: 0, approvedAmount: 0 };
  this.data.options.statuses.forEach(s => {
    stats[s.value] = projects.filter(p => p.status === s.value).length;
  });
  stats.totalAmount = projects.reduce((sum, p) => sum + p.amount, 0);
  const completedStatus = this.data.options.statuses.find(s => s.label === '已完成');
  if (completedStatus) {
    stats.approvedAmount = projects.filter(p => p.status === completedStatus.value).reduce((sum, p) => sum + p.amount, 0);
    stats.passRate = total > 0 ? ((stats[completedStatus.value] || 0) / total * 100).toFixed(1) : 0;
  }
  return stats;
},

      getStageStats() {
        const stages = ['pre', 'mid', 'post'];
        const stats = {};
        stages.forEach(s => {
          const projects = this.data.projects.filter(p => p.stage === s);
          stats[s] = {
            total: projects.length,
            pending: projects.filter(p => p.status === 'pending').length,
            processing: projects.filter(p => p.status === 'processing').length,
            completed: projects.filter(p => p.status === 'completed').length,
            rejected: projects.filter(p => p.status === 'rejected').length
          };
        });
        return stats;
      },

      clearStageFilter() {
        this.data.filterStage = '';
        this.render();
      },

formatAmount(amount) {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', minimumFractionDigits: 0 }).format(amount);
  },

  formatAmountInWan(amount) {
    return (amount / 10000).toFixed(2) + '万元';
  },

getUrgencyText(urgency) {
  const found = this.data.options.urgencies.find(u => u.value === urgency);
  return found ? found.label : urgency;
},

  getUrgencyClass(urgency) {
    return urgency === 'very_urgent' ? 'urgency-very-urgent' : (urgency === 'urgent' ? 'urgency-urgent' : 'urgency-normal');
  },

      formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('zh-CN');
      },

getStatusText(status) {
  const found = this.data.options.statuses.find(s => s.value === status);
  return found ? found.label : status;
},

getStageText(stage) {
  const found = this.data.options.stages.find(s => s.value === stage);
  return found ? found.label : stage;
},

      getCustomerTypeText(type) {
        return type === 'enterprise' ? '企业客户' : '个人客户';
      },

getGuaranteeTypeText(type) {
  const found = this.data.options.guaranteeTypes.find(g => g.value === type);
  return found ? found.label : type;
},

      render() {
        const page = this.data.currentPage;
        const titles = { dashboard: '仪表板', projects: '项目管理', tasks: '待办任务', statistics: '数据统计', settings: '系统设置' };
        document.getElementById('pageTitle').textContent = titles[page] || '仪表板';

        const renderers = {
          dashboard: () => this.renderDashboard(),
          projects: () => this.renderProjects(),
          customers: () => this.renderCustomers(),
          tasks: () => this.renderTasks(),
          statistics: () => this.renderStatistics(),
          deposits: () => this.renderDeposits(),
          settings: () => this.renderSettings()
        };

        document.getElementById('content').innerHTML = (renderers[page] || renderers.dashboard)();
        this.bindPageEvents();
      },

renderDashboard() {
  const stats = this.getStats();
  const allProjects = this.data.projects;
  const pendingProjects = allProjects.filter(p => {
    const completedStatus = this.data.options.statuses.find(s => s.label === '已完成');
    return !completedStatus || p.status !== completedStatus.value;
  });
  const unfinishedProjects = pendingProjects.sort((a, b) => {
    const daysA = Math.floor((Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    const daysB = Math.floor((Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    return daysB - daysA;
  }).slice(0, 5);
  const importantProjects = [...allProjects].sort((a, b) => {
    const urgencyOrder = { very_urgent: 3, urgent: 2, normal: 1 };
    return (urgencyOrder[b.urgency] || 1) - (urgencyOrder[a.urgency] || 1);
  }).slice(0, 5);
  const recentProjects = this.getFilteredProjects().slice(0, 5);
  const projectTasks = this.data.projects.flatMap(p => p.tasks.filter(t => !t.completed));
  const standaloneTasks = this.data.tasks.filter(t => !t.completed);
  const pendingTasks = [...projectTasks, ...standaloneTasks].slice(0, 8);

  const currentTab = this.data.projectTab;
  const displayProjects = currentTab === 'unfinished' ? unfinishedProjects : (currentTab === 'important' ? importantProjects : recentProjects);
  const tabTitle = currentTab === 'unfinished' ? '未完成项目' : (currentTab === '重要项目' ? '重要项目' : '最近项目');

  return `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon primary">📁</div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">总项目数</div>
      </div>
<div class="stat-card">
  <div class="stat-icon warning">⏳</div>
  <div class="stat-value">${(stats.pending || 0) + (stats.processing || 0)}</div>
  <div class="stat-label">待处理项目</div>
</div>
      <div class="stat-card">
        <div class="stat-icon accent">💰</div>
        <div class="stat-value">${(stats.totalAmount / 10000).toFixed(0)}万</div>
        <div class="stat-label">申请总额</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon danger">✓</div>
        <div class="stat-value">${stats.passRate}%</div>
        <div class="stat-label">通过率</div>
      </div>
    </div>

<div class="section fade-in">
  <div class="section-header">
    <div style="display:flex;align-items:center;gap:16px;">
      <h3 class="section-title">${tabTitle}</h3>
      <div style="display:flex;gap:8px;">
        <button class="btn ${currentTab === 'recent' ? 'btn-primary' : 'btn-secondary'}" style="padding:4px 12px;font-size:12px;" onclick="App.switchProjectTab('recent')">最近项目</button>
        <button class="btn ${currentTab === 'unfinished' ? 'btn-primary' : 'btn-secondary'}" style="padding:4px 12px;font-size:12px;" onclick="App.switchProjectTab('unfinished')">未完成</button>
        <button class="btn ${currentTab === 'important' ? 'btn-primary' : 'btn-secondary'}" style="padding:4px 12px;font-size:12px;" onclick="App.switchProjectTab('important')">重要项目</button>
      </div>
    </div>
    <button class="btn btn-secondary" onclick="App.navigateTo('projects')">查看全部</button>
  </div>
  <div class="section-body">
    <table class="projects-table">
      <thead>
        <tr>
          <th>项目编号</th>
          <th>项目名称</th>
          <th>客户名称</th>
          <th>授信金额</th>
          <th>紧急度</th>
          <th>当前阶段</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
      ${displayProjects.map(p => `
        <tr>
          <td>${p.id}</td>
          <td><span class="project-name" onclick="App.showProjectDetail('${p.id}')">${p.name}</span></td>
          <td style="white-space:nowrap;">${(p.customerNames || []).map(n => `<div>${n}</div>`).join('')}</td>
          <td class="amount" style="text-align:right;">${this.formatAmountInWan(p.amount)}</td>
          <td><span class="urgency-badge ${this.getUrgencyClass(p.urgency)}">${this.getUrgencyText(p.urgency)}</span></td>
          <td><span class="stage-badge ${p.stage}">${this.getStageText(p.stage)}</span></td>
          <td><span class="status-badge ${p.status}">${this.getStatusText(p.status)}</span></td>
        </tr>
      `).join('')}
      </tbody>
    </table>
  </div>
</div>

<div class="section fade-in">
  <div class="section-header">
    <h3 class="section-title">待办任务</h3>
  </div>
  <div class="section-body">
  ${pendingTasks.length > 0 ? `
  <ul class="task-list">
  ${pendingTasks.map(t => {
    const isStandalone = !this.data.projects.some(p => p.tasks && p.tasks.some(pt => pt.id === t.id));
    const customer = isStandalone ? this.data.customers.find(c => c.customerNo === t.customerNo) : null;
    return `
    <li class="task-item">
      <div class="task-checkbox" onclick="${isStandalone ? `App.toggleStandaloneTask('${t.id}')` : `App.toggleTask('${t.id}')`}"></div>
      <div class="task-content">
        <div class="task-title">${t.title}</div>
        <div class="task-meta">${isStandalone ? (customer ? `客户: ${customer.name}` : '') : '项目: ' + (this.data.projects.find(p => p.tasks && p.tasks.some(pt => pt.id === t.id))?.name || '')}</div>
      </div>
    </li>
    `;
  }).join('')}
  </ul>
  ` : `
  <div class="empty-state">
    <div class="empty-icon">✅</div>
    <p>暂无数待办任务</p>
  </div>
  `}
  </div>
  </div>
  `;
  },

renderProjects() {
    const projects = this.getFilteredProjects();
    const stageFilter = this.data.filterStage;
    const stageStats = this.getStageStats();
    const stageNames = { pre: '贷前调查', mid: '贷中审批', post: '贷后管理' };
    const postLoanCalendar = stageFilter === 'post' ? this.renderPostLoanCalendar() : '';

    return `
      ${stageFilter ? `
      <div class="stats-grid fade-in" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-icon primary">📁</div>
          <div class="stat-value">${stageStats[stageFilter].total}</div>
          <div class="stat-label">${stageNames[stageFilter]} - 项目数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon warning">⏳</div>
          <div class="stat-value">${stageStats[stageFilter].pending}</div>
          <div class="stat-label">待处理</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon accent">✓</div>
          <div class="stat-value">${stageStats[stageFilter].completed}</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>
      ${postLoanCalendar}
      ` : ''}
<div class="filter-bar fade-in">
  <select class="filter-select" id="statusFilter" onchange="App.filterByStatus()">
    <option value="">全部状态</option>
    ${this.data.options.statuses.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
  </select>
  <select class="filter-select" id="stageFilter" onchange="App.filterByStage()">
    <option value="">全部阶段</option>
    ${this.data.options.stages.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}
  </select>
  ${stageFilter ? `<button class="btn btn-secondary" onclick="App.clearStageFilter()">清除筛选</button>` : ''}
  <button class="btn btn-primary" onclick="App.exportProjectsXlsx()">导出Excel</button>
</div>

    <div class="section fade-in">
      <div class="section-body" style="padding: 0;">
        <table class="projects-table">
          <thead>
            <tr>
              <th>项目编号</th>
              <th>项目名称</th>
              <th>客户名称</th>
              <th>授信金额</th>
              <th>紧急度</th>
              <th>当前阶段</th>
              <th>状态</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${projects.length > 0 ? projects.map(p => {
    const start = new Date(p.createdAt).getTime();
    const end = p.endDate ? new Date(p.endDate).getTime() : Date.now();
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const maxDays = p.term * 30;
    const percent = Math.min((days / maxDays) * 100, 100);
    const r = Math.min(255, Math.floor((percent / 100) * 255));
    const g = Math.min(255, Math.floor((1 - percent / 100) * 200 + 50));
    const color = `rgb(${r}, ${g}, 80)`;
    const color2 = p.endDate ? '#38a169' : color;
    const currentNode = p.stage === 'pre' ? '客户尽职调查' : (p.stage === 'mid' ? '初审评估' : '首次检查');
    return `
            <tr>
              <td>${p.id}</td>
              <td><span class="project-name" onclick="App.showProjectDetail('${p.id}')">${p.name}</span></td>
              <td style="white-space:nowrap;">${(p.customerNames || []).map(n => `<div>${n}</div>`).join('')}</td>
              <td class="amount" style="text-align:right;">${this.formatAmountInWan(p.amount)}</td>
              <td><span class="urgency-badge ${this.getUrgencyClass(p.urgency)}">${this.getUrgencyText(p.urgency)}</span></td>
              <td><span class="stage-badge ${p.stage}">${this.getStageText(p.stage)}</span></td>
              <td><span class="status-badge ${p.status}">${this.getStatusText(p.status)}</span></td>
              <td>${this.formatDate(p.createdAt)}</td>
              <td>${p.endDate ? this.formatDate(p.endDate) : (p.status === 'completed' ? this.formatDate(new Date().toISOString()) : '-')}</td>
              <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;" onclick="App.editProject('${p.id}')">编辑</button>
                <button class="btn btn-danger" style="padding: 6px 12px; font-size: 12px; margin-left: 8px;" onclick="App.deleteProject('${p.id}')">删除</button>
              </td>
            </tr>
            <tr class="project-row-second">
              <td colspan="2"></td>
              <td colspan="5">
                <div class="duration-bar-container">
                  <span style="white-space:nowrap;">项目耗时: ${days}天</span>
                  <div class="duration-bar">
                    <div class="duration-bar-fill" style="width:${percent}%;background:${color2};"></div>
                  </div>
                  <span>${percent.toFixed(0)}%</span>
                </div>
              </td>
              <td colspan="3">
                <span class="current-node">📍 当前节点: ${currentNode}</span>
              </td>
            </tr>
            `;
    }).join('') : `
            <tr>
              <td colspan="9">
                <div class="empty-state">
                  <div class="empty-icon">📁</div>
                  <p>暂无数项目数据</p>
                </div>
              </td>
            </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
    `;
  },

renderTasks() {
  const tasks = this.data.tasks;
  const customers = this.data.customers;
  const filterCustomer = this.data.filterTaskCustomer || '';

  const filteredTasks = filterCustomer 
    ? tasks.filter(t => t.customerNo === filterCustomer)
    : tasks;

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const getCustomerName = (customerNo) => {
    const c = customers.find(cust => cust.customerNo === customerNo);
    return c ? c.name : '-';
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  };

  return `
  <div class="fade-in">
    <div class="filter-bar">
      <select class="filter-select" id="taskCustomerFilter" onchange="App.filterTasksByCustomer()">
        <option value="">全部客户</option>
        ${customers.map(c => `<option value="${c.customerNo}" ${filterCustomer === c.customerNo ? 'selected' : ''}>${c.name}</option>`).join('')}
      </select>
      <button class="btn btn-primary" onclick="App.openTaskModal()">+ 新增任务</button>
    </div>

    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
      <div class="stat-card">
        <div class="stat-icon warning">⏳</div>
        <div class="stat-value">${pendingTasks.length}</div>
        <div class="stat-label">待办任务</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon accent">✓</div>
        <div class="stat-value">${completedTasks.length}</div>
        <div class="stat-label">已完成</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon danger">⚠️</div>
        <div class="stat-value">${pendingTasks.filter(t => isOverdue(t.dueDate)).length}</div>
        <div class="stat-label">已逾期</div>
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h3 class="section-title">任务列表</h3>
      </div>
      <div class="section-body">
        ${filteredTasks.length > 0 ? `
        <table class="projects-table">
          <thead>
            <tr>
              <th style="width:40px;">状态</th>
              <th>任务标题</th>
              <th>客户</th>
              <th>到期时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${[...pendingTasks, ...completedTasks].map(t => {
              const overdue = !t.completed && isOverdue(t.dueDate);
              return `
              <tr>
                <td>
                  <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="App.toggleStandaloneTask('${t.id}')" style="cursor:pointer;">
                    ${t.completed ? '✓' : ''}
                  </div>
                </td>
                <td><span class="${t.completed ? 'checked' : ''}" style="${t.completed ? 'text-decoration:line-through;color:var(--text-lighter);' : ''}">${t.title}</span></td>
                <td>${getCustomerName(t.customerNo)}</td>
                <td style="${overdue ? 'color:var(--danger);font-weight:600;' : ''}">${t.dueDate || '-'}${overdue ? ' <span style="font-size:11px;background:var(--danger);color:white;padding:2px 6px;border-radius:4px;">逾期</span>' : ''}</td>
                <td>
                  <button class="btn btn-secondary" style="padding:4px 8px;font-size:12px;margin-right:4px;" onclick="App.editTask('${t.id}')">编辑</button>
                  <button class="btn btn-danger" style="padding:4px 8px;font-size:12px;" onclick="App.deleteTask('${t.id}')">删除</button>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        ` : `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <p>暂无任务</p>
        </div>
        `}
</div>
  </div>
  </div>
  `;
},

filterTasksByCustomer() {
  const filter = document.getElementById('taskCustomerFilter');
  this.data.filterTaskCustomer = filter ? filter.value : '';
  this.render();
},

openTaskModal(task = null) {
  const isEdit = task != null;
  document.getElementById('detailModal').classList.add('active');
  document.querySelector('#detailModal .modal-title').textContent = isEdit ? '编辑任务' : '新增任务';

  document.getElementById('detailContent').innerHTML = `
    <form style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
      <div class="form-group">
        <label class="form-label">任务标题 *</label>
        <input type="text" class="form-input" id="taskTitle" value="${task ? task.title : ''}" placeholder="请输入任务标题" required>
      </div>
      <div class="form-group">
        <label class="form-label">客户 *</label>
        <select class="form-select" id="taskCustomer" required>
          <option value="">请选择客户</option>
          ${this.data.customers.map(c => `<option value="${c.customerNo}" ${task && task.customerNo === c.customerNo ? 'selected' : ''}>${c.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="grid-column: span 2;">
        <label class="form-label">到期时间</label>
        <input type="date" class="form-input" id="taskDueDate" value="${task ? task.dueDate : ''}">
      </div>
    </form>
    <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px;">
      <button class="btn btn-secondary" onclick="App.closeModal('detailModal')">取消</button>
      <button class="btn btn-primary" onclick="App.saveTask(${isEdit ? `'${task.id}'` : 'null'})">保存</button>
    </div>
  `;
},

editTask(id) {
  const task = this.data.tasks.find(t => t.id === id);
  if (task) this.openTaskModal(task);
},

deleteTask(id) {
  if (confirm('确定要删除这个任务吗？')) {
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.saveData();
    this.render();
  }
},

saveTask(existingId) {
  const title = document.getElementById('taskTitle').value.trim();
  const customerNo = document.getElementById('taskCustomer').value;
  const dueDate = document.getElementById('taskDueDate').value;

  if (!title) { alert('请输入任务标题'); return; }
  if (!customerNo) { alert('请选择客户'); return; }

  if (existingId) {
    const idx = this.data.tasks.findIndex(t => t.id === existingId);
    this.data.tasks[idx] = { id: existingId, title, customerNo, dueDate, completed: this.data.tasks[idx].completed };
  } else {
    const newId = 'T' + String(this.data.tasks.length + 1).padStart(3, '0');
    this.data.tasks.push({ id: newId, title, customerNo, dueDate, completed: false });
  }

  this.saveData();
  this.closeModal('detailModal');
  this.render();
  alert('保存成功');
},

toggleStandaloneTask(id) {
  const task = this.data.tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    this.saveData();
    this.render();
  }
},

renderStatistics() {
    const stats = this.getStats();
const stageCounts = {};
  this.data.options.stages.forEach(s => stageCounts[s.value] = 0);
  this.data.projects.forEach(p => { if (stageCounts[p.stage] !== undefined) stageCounts[p.stage]++; });

  const total = stats.total || 1;
  const statusColors = { pending: '#dd6b20', processing: '#1a365d', completed: '#38a169', rejected: '#e53e3e' };
  const stageColors = { pre: '#2b6cb0', mid: '#b7791f', post: '#276749' };

  const statusData = this.data.options.statuses.map(s => ({
    key: s.value,
    label: s.label,
    count: stats[s.value] || 0,
    color: statusColors[s.value] || '#718096'
  }));

  const stageData = this.data.options.stages.map(s => ({
    key: s.value,
    label: s.label,
    count: stageCounts[s.value] || 0,
    color: stageColors[s.value] || '#718096'
  }));

    const buildPie = (data) => {
      let gradient = '';
      let current = 0;
      data.forEach((item, i) => {
        if (item.count > 0) {
          const start = current;
          current += (item.count / total) * 360;
          const end = current;
          gradient += (gradient ? ', ' : '') + item.color + ' ' + start + 'deg ' + end + 'deg';
        }
      });
      return gradient || '#e2e8f0 0deg 360deg';
    };

    const statusGradient = buildPie(statusData);
    const stageGradient = buildPie(stageData);

    return `
    <div class="stats-grid fade-in">
      <div class="stat-card">
        <div class="stat-icon primary">📁</div>
        <div class="stat-value">${stats.total}</div>
        <div class="stat-label">总项目数</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon accent">💰</div>
        <div class="stat-value">${(stats.totalAmount / 10000).toFixed(0)}万</div>
        <div class="stat-label">申请总额</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon primary">✓</div>
        <div class="stat-value">${(stats.approvedAmount / 10000).toFixed(0)}万</div>
        <div class="stat-label">已放款总额</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon danger">📊</div>
        <div class="stat-value">${stats.passRate}%</div>
        <div class="stat-label">项目通过率</div>
      </div>
    </div>

          <div class="detail-grid fade-in">
            <div class="card" style="text-align:center;">
              <h3 style="margin-bottom: 16px; font-size: 16px;">项目状态分布（点击进入筛选）</h3>
              <div style="display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;">
                <div style="position:relative;">
                  <div style="width:150px;height:150px;border-radius:50%;background:conic-gradient(${statusGradient});cursor:pointer;" onclick="App.filterByStatus()"></div>
                </div>
                <div style="text-align:left;">
                  ${statusData.map(s => `<div style="display:flex;align-items:center;gap:8px;margin:8px 0;cursor:pointer;" onclick="App.filterProjectByStatus('${s.key}')"><span style="width:12px;height:12px;background:${s.color};border-radius:2px;"></span><span>${s.label}: ${s.count}</span></div>`).join('')}
                </div>
              </div>
            </div>

            <div class="card" style="text-align:center;">
              <h3 style="margin-bottom: 16px; font-size: 16px;">项目阶段分布（点击进入筛选）</h3>
              <div style="display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;">
                <div style="position:relative;">
                  <div style="width:150px;height:150px;border-radius:50%;background:conic-gradient(${stageGradient});cursor:pointer;" onclick="App.filterByStage()"></div>
                </div>
                <div style="text-align:left;">
                  ${stageData.map(s => `<div style="display:flex;align-items:center;gap:8px;margin:8px 0;cursor:pointer;" onclick="App.filterProjectByStage('${s.key}')"><span style="width:12px;height:12px;background:${s.color};border-radius:2px;"></span><span>${s.label}: ${s.count}</span></div>`).join('')}
                </div>
              </div>
</div>
</div>
`;
},

renderPostLoanCalendar() {
const calendarDate = this.data.calendarDate ? new Date(this.data.calendarDate) : new Date();
const now = new Date();
const year = calendarDate.getFullYear();
const month = calendarDate.getMonth();
const today = now.getDate();
const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const daysInMonth = lastDay.getDate();
const startWeekday = firstDay.getDay();
const monthName = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][month];

const postProjects = this.data.projects.filter(p => p.stage === 'post');
const customerTaskMap = {};
postProjects.forEach(p => {
    (p.customerIds || []).forEach(cid => {
      const customer = this.data.customers.find(c => c.customerNo === cid);
      if (customer) {
        if (!customerTaskMap[cid]) {
          customerTaskMap[cid] = { name: customer.name, customerNo: cid, days: new Set() };
        }
        customerTaskMap[cid].days.add(Math.floor(Math.random() * daysInMonth) + 1);
      }
    });
  });

const customerNames = Object.values(customerTaskMap).map(c => c.name + (c.customerNo ? ' (' + c.customerNo + ')' : ''));

const customersWithTasks = Object.values(customerTaskMap);

return '<div class="card fade-in" style="margin-bottom: 24px;">' +
'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
'<div style="display:flex;align-items:center;gap:12px;">' +
'<button class="btn btn-secondary" style="padding:6px 12px;" onclick="App.changeCalendarMonth(-1)">◀ 上月</button>' +
'<h3 style="font-size:16px;">' + year + '年 ' + monthName + '</h3>' +
'<button class="btn btn-secondary" style="padding:6px 12px;" onclick="App.changeCalendarMonth(1)">下月 ▶</button>' +
'</div>' +
'<div style="font-size:12px;color:var(--text-light);">有贷后任务的客户: ' + (customerNames.join(', ') || '暂无') + '</div>' +
'</div>' +
'<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;">' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">日</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">一</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">二</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">三</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">四</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">五</div>' +
'<div style="font-size:12px;color:var(--text-light);padding:8px 0;">六</div>' +
Array(startWeekday).fill('<div style="padding:8px;"></div>').join('') +
Array.from({length: daysInMonth}, function(_, i) {
const day = i + 1;
const isToday = isCurrentMonth && day === today;
const customersOnDay = customersWithTasks.filter(function(c) { return c.days.has(day); });
const hasTask = customersOnDay.length > 0;
const customerNamesOnDay = customersOnDay.map(function(c) { return c.name; }).join('<br>');
let style = 'padding:8px;font-size:12px;';
if (isToday) {
style += 'border:2px solid var(--primary);border-radius:4px;';
}
if (hasTask) {
style += 'background:var(--accent);color:white;border-radius:4px;';
} else if (!isToday) {
style += 'background:var(--bg);';
}
return '<div style="' + style + '">' + day + (customerNamesOnDay ? '<br>' + customerNamesOnDay : '') + '</div>';
}).join('') +
'</div>' +
'</div>';
},

changeCalendarMonth(delta) {
if (!this.data.calendarDate) {
this.data.calendarDate = new Date().toISOString();
}
const d = new Date(this.data.calendarDate);
d.setMonth(d.getMonth() + delta);
this.data.calendarDate = d.toISOString();
this.render();
},

renderCustomers() {
        const customers = this.data.customers;
        return `
          <div class="card fade-in" style="margin-bottom: 24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
              <h3 style="font-size:16px;">客户列表</h3>
              <button class="btn btn-primary" onclick="App.openCustomerModal()">+ 新增客户</button>
            </div>
<table class="projects-table">
    <thead>
      <tr>
        <th>客户号</th>
        <th>客户名称</th>
        <th>客户账号</th>
        <th>类型</th>
        <th>联系人</th>
        <th>联系电话</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
    ${customers.map(c => `
    <tr>
      <td>${c.customerNo || '-'}</td>
      <td>${c.name}</td>
      <td>${(c.accounts || []).map(a => `<div>${a}</div>`).join('') || '-'}</td>
      <td>${c.type === 'enterprise' ? '企业' : '个人'}</td>
      <td>${c.contact || '-'}</td>
      <td>${c.phone}</td>
      <td>
        <button class="btn btn-secondary" style="padding:4px 8px;font-size:12px;" onclick="App.editCustomer('${c.customerNo}')">编辑</button>
      </td>
    </tr>
    `).join('')}
    </tbody>
  </table>
          </div>
        `;
      },

      openCustomerModal(customer = null) {
        const content = document.getElementById('detailContent');
        const isEdit = customer != null;
        document.getElementById('detailModal').classList.add('active');
        document.querySelector('#detailModal .modal-title').textContent = isEdit ? '编辑客户' : '新增客户';
document.getElementById('detailContent').innerHTML = `
  <form style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
    <div class="form-group">
      <label class="form-label">客户号（唯一）*</label>
      <input type="text" class="form-input" id="custNo" value="${customer ? customer.customerNo || '' : ''}" placeholder="如：20260001" required ${isEdit ? 'readonly' : ''}>
    </div>
    <div class="form-group">
      <label class="form-label">客户名称 *</label>
      <input type="text" class="form-input" id="custName" value="${customer ? customer.name : ''}" required>
    </div>
    <div class="form-group">
      <label class="form-label">客户账号（多个用逗号分隔）</label>
      <input type="text" class="form-input" id="custAccounts" value="${customer ? (customer.accounts || []).join(', ') : ''}" placeholder="如：6222021234567890, 6222021234567891">
    </div>
    <div class="form-group">
      <label class="form-label">客户类型 *</label>
      <select class="form-select" id="custType">
        <option value="enterprise" ${customer && customer.type === 'enterprise' ? 'selected' : ''}>企业客户</option>
        <option value="personal" ${customer && customer.type === 'personal' ? 'selected' : ''}>个人客户</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">联系人</label>
      <input type="text" class="form-input" id="custContact" value="${customer ? customer.contact || '' : ''}">
    </div>
    <div class="form-group">
      <label class="form-label">联系电话</label>
      <input type="text" class="form-input" id="custPhone" value="${customer ? customer.phone || '' : ''}">
    </div>
    <div class="form-group">
      <label class="form-label">地址</label>
      <input type="text" class="form-input" id="custAddress" value="${customer ? customer.address || '' : ''}">
    </div>
  </form>
  <div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px;">
    <button class="btn btn-secondary" onclick="App.closeModal('detailModal')">取消</button>
    <button class="btn btn-primary" onclick="App.saveCustomer(${isEdit ? `'${customer.customerNo}'` : 'null'})">保存</button>
  </div>
`;
      },

editCustomer(customerNo) {
  const customer = this.data.customers.find(c => c.customerNo === customerNo);
  if (customer) this.openCustomerModal(customer);
},

saveCustomer(existingCustomerNo) {
  const customerNo = document.getElementById('custNo').value.trim();
  const name = document.getElementById('custName').value;
  const accountsInput = document.getElementById('custAccounts').value;
  const accounts = accountsInput ? accountsInput.split(',').map(a => a.trim()).filter(a => a) : [];
  const type = document.getElementById('custType').value;
  const contact = document.getElementById('custContact').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;

  if (!customerNo) { alert('请输入客户号'); return; }
  if (!name) { alert('请输入客户名称'); return; }

  const customerData = { customerNo, name, accounts, type, contact, phone, address };
  if (existingCustomerNo) {
    const idx = this.data.customers.findIndex(c => c.customerNo === existingCustomerNo);
    this.data.customers[idx] = customerData;
  } else {
    this.data.customers.push(customerData);
  }

  this.saveData();
  this.closeModal('detailModal');
  this.render();
  alert('保存成功');
},

      renderDeposits() {
        const deposits = this.data.deposits;
        const totalDeposits = deposits.reduce((sum, d) => sum + d.amount, 0);
        const fixedDeposits = deposits.filter(d => d.type === '定期').reduce((sum, d) => sum + d.amount, 0);
        const currentDeposits = deposits.filter(d => d.type === '活期').reduce((sum, d) => sum + d.amount, 0);
        const customerCount = new Set(deposits.map(d => d.customerId)).size;

        return `
<div class="stats-grid fade-in">
  <div class="stat-card">
    <div class="stat-icon primary">💵</div>
    <div class="stat-value">${(totalDeposits / 10000).toFixed(0)}万</div>
    <div class="stat-label">存款总额</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon accent">🏦</div>
    <div class="stat-value">${(fixedDeposits / 10000).toFixed(0)}万</div>
    <div class="stat-label">定期存款</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon warning">📊</div>
    <div class="stat-value">${(currentDeposits / 10000).toFixed(0)}万</div>
    <div class="stat-label">活期存款</div>
  </div>
  <div class="stat-card">
    <div class="stat-icon danger">👥</div>
    <div class="stat-value">${customerCount}</div>
    <div class="stat-label">存款客户数</div>
  </div>
</div>

<div class="card fade-in">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
    <h3 style="font-size:16px;">客户存款明细</h3>
    <button class="btn btn-primary" onclick="App.openDepositModal()">+ 新增存款</button>
  </div>
  <table class="projects-table">
    <thead>
      <tr>
        <th>存款编号</th>
        <th>客户名称</th>
        <th>产品名称</th>
        <th>存款类型</th>
        <th>存款金额</th>
        <th>对客利率(%)</th>
        <th>FTP利率(%)</th>
        <th>利差(%)</th>
        <th>存款日期</th>
        <th>到期日</th>
        <th>剩余期限</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
    ${deposits.map(d => {
      const spread = (d.rate || 0) - (d.ftpRate || 0);
      let daysLeft = '';
      let daysStyle = '';
      if (d.maturityDate) {
        const maturity = new Date(d.maturityDate);
        const today = new Date();
        const diff = Math.ceil((maturity - today) / (1000 * 60 * 60 * 24));
        if (diff > 0) {
          daysLeft = diff + '天';
          if (diff < 30) daysStyle = 'color:#e53e3e;font-weight:600;';
        } else {
          daysLeft = '已到期';
        }
      }
      return `
      <tr>
        <td>${d.id}</td>
        <td>${d.customerName}</td>
        <td>${d.productName || '-'}</td>
        <td>${d.type === '定期' ? '<span class="stage-badge post">定期</span>' : '<span class="stage-badge mid">活期</span>'}</td>
        <td class="amount" style="text-align:right;">${this.formatAmountInWan(d.amount)}</td>
        <td>${d.rate || 0}%</td>
        <td>${d.ftpRate || 0}%</td>
        <td style="color:${spread >= 0 ? '#38a169' : '#e53e3e'};font-weight:500;">${spread.toFixed(2)}%</td>
        <td>${d.date}</td>
        <td>${d.maturityDate || '-'}</td>
        <td style="${daysStyle}">${daysLeft || '-'}</td>
        <td>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:12px;margin-right:8px;" onclick="App.editDeposit('${d.id}')">编辑</button>
          <button class="btn btn-danger" style="padding:4px 8px;font-size:12px;" onclick="App.deleteDeposit('${d.id}')">删除</button>
        </td>
      </tr>
    `}).join('')}
    </tbody>
  </table>
</div>
        `;
      },

renderSettings() {
  const renderOptionItems = (options, type) => {
    return options.map(opt => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg);border-radius:4px;margin-bottom:8px;">
        <span><strong>${opt.value}</strong> - ${opt.label}</span>
        <div>
          <button class="btn btn-secondary" style="padding:4px 8px;font-size:12px;margin-right:4px;" onclick="App.editOption('${type}', '${opt.value}')">编辑</button>
          <button class="btn btn-danger" style="padding:4px 8px;font-size:12px;" onclick="App.deleteOption('${type}', '${opt.value}')">删除</button>
        </div>
      </div>
    `).join('');
  };

  return `
  <div class="card fade-in">
    <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;margin-bottom:24px;" onclick="App.toggleSection('pwSection')">
      <h3 style="font-size:16px;">🔐 密码管理</h3>
      <span id="pwSectionIcon" style="font-size:12px;">▼</span>
    </div>
    <div id="pwSection">
      <div class="form-group">
        <label class="form-label">当前密码</label>
        <input type="password" class="form-input" id="currentPassword" placeholder="请输入当前密码">
      </div>
      <div class="form-group">
        <label class="form-label">新密码</label>
        <input type="password" class="form-input" id="newPassword" placeholder="请输入新密码（至少6位）">
      </div>
      <div class="form-group">
        <label class="form-label">确认新密码</label>
        <input type="password" class="form-input" id="confirmPassword" placeholder="请再次输入新密码">
      </div>
      <button class="btn btn-primary" onclick="App.changePassword()">修改密码</button>
    </div>
  </div>

  <div class="card fade-in" style="margin-top: 24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;margin-bottom:24px;" onclick="App.toggleSection('optSection')">
      <h3 style="font-size:16px;">📋 选项配置管理</h3>
      <span id="optSectionIcon" style="font-size:12px;">▼</span>
    </div>
    <div id="optSection">
      <div style="margin-bottom: 24px;">
        <h4 style="font-size:14px;margin-bottom:12px;color:var(--primary);">当前阶段</h4>
        ${renderOptionItems(this.data.options.stages, 'stages')}
        <button class="btn btn-secondary" onclick="App.addOption('stages')">+ 添加阶段</button>
      </div>
      <div style="margin-bottom: 24px;">
        <h4 style="font-size:14px;margin-bottom:12px;color:var(--primary);">状态</h4>
        ${renderOptionItems(this.data.options.statuses, 'statuses')}
        <button class="btn btn-secondary" onclick="App.addOption('statuses')">+ 添加状态</button>
      </div>
      <div style="margin-bottom: 24px;">
        <h4 style="font-size:14px;margin-bottom:12px;color:var(--primary);">授信期限</h4>
        ${renderOptionItems(this.data.options.terms, 'terms')}
        <button class="btn btn-secondary" onclick="App.addOption('terms')">+ 添加期限</button>
      </div>
      <div style="margin-bottom: 24px;">
        <h4 style="font-size:14px;margin-bottom:12px;color:var(--primary);">担保方式</h4>
        ${renderOptionItems(this.data.options.guaranteeTypes, 'guaranteeTypes')}
        <button class="btn btn-secondary" onclick="App.addOption('guaranteeTypes')">+ 添加担保方式</button>
      </div>
      <div style="margin-bottom: 24px;">
        <h4 style="font-size:14px;margin-bottom:12px;color:var(--primary);">紧急度</h4>
        ${renderOptionItems(this.data.options.urgencies, 'urgencies')}
        <button class="btn btn-secondary" onclick="App.addOption('urgencies')">+ 添加紧急度</button>
      </div>
    </div>
  </div>

  <div class="card fade-in" style="margin-top: 24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;margin-bottom:24px;" onclick="App.toggleSection('sysSection')">
      <h3 style="font-size:16px;">⚙️ 系统设置</h3>
      <span id="sysSectionIcon" style="font-size:12px;">▼</span>
    </div>
    <div id="sysSection">
      <div class="form-group">
        <label class="form-label">默认利率（%）</label>
        <input type="number" class="form-input" value="4.35" step="0.01">
      </div>
      <div class="form-group">
        <label class="form-label">默认授信期限</label>
        <select class="form-select">
          ${this.data.options.terms.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">默认担保方式</label>
        <select class="form-select">
          ${this.data.options.guaranteeTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary">保存设置</button>
    </div>
  </div>

  <div class="card fade-in" style="margin-top: 24px;">
    <div style="display:flex;justify-content:space-between;align-items:center;cursor:pointer;margin-bottom:24px;" onclick="App.toggleSection('dataSection')">
      <h3 style="font-size:16px;">💾 数据管理</h3>
      <span id="dataSectionIcon" style="font-size:12px;">▼</span>
    </div>
    <div id="dataSection">
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button class="btn btn-secondary" onclick="App.exportData()">导出数据</button>
        <button class="btn btn-secondary" onclick="App.importData()">导入数据</button>
        <button class="btn btn-danger" onclick="App.clearData()">清空数据</button>
      </div>
    </div>
  </div>
`;
},

showProjectDetail(id) {
    const project = this.data.projects.find(p => p.id === id);
    if (!project) return;

    const postLoanDates = project.postLoanTaskDates || [];
    const detailContent = `
    <div class="flow-container">
      <div class="flow-stage ${project.stageProgress.pre === 100 ? 'completed' : project.stage === 'pre' ? 'active' : ''}">
        <div class="flow-icon">🔍</div>
        <div class="flow-label">贷前调查</div>
        <div class="flow-status">${project.stageProgress.pre === 100 ? '已完成' : project.stageProgress.pre + '%'}</div>
      </div>
      <div class="flow-stage ${project.stageProgress.mid === 100 ? 'completed' : project.stage === 'mid' ? 'active' : ''}">
        <div class="flow-icon">📋</div>
        <div class="flow-label">贷中审批</div>
        <div class="flow-status">${project.stageProgress.mid === 100 ? '已完成' : project.stageProgress.mid + '%'}</div>
      </div>
      <div class="flow-stage ${project.stageProgress.post === 100 ? 'completed' : project.stage === 'post' ? 'active' : ''}">
        <div class="flow-icon">📊</div>
        <div class="flow-label">贷后管理</div>
        <div class="flow-status">${project.stageProgress.post === 100 ? '已完成' : project.stageProgress.post + '%'}</div>
      </div>
    </div>

    <div class="detail-grid">
      <div>
        <h4 style="margin-bottom: 16px; font-size: 14px; color: var(--text-light);">基本信息</h4>
        <div class="detail-item">
          <div class="detail-label">项目编号</div>
          <div class="detail-value">${project.id}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">项目名称</div>
          <div class="detail-value">${project.name}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">客户</div>
          <div class="detail-value">${(project.customerNames || []).join(', ')}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">创建时间</div>
          <div class="detail-value">${this.formatDate(project.createdAt)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">紧急度</div>
          <div class="detail-value"><span class="urgency-badge ${this.getUrgencyClass(project.urgency)}">${this.getUrgencyText(project.urgency)}</span></div>
        </div>
      </div>
      <div>
        <h4 style="margin-bottom: 16px; font-size: 14px; color: var(--text-light);">授信信息</h4>
        <div class="detail-item">
          <div class="detail-label">授信金额</div>
          <div class="detail-value amount">${this.formatAmountInWan(project.amount)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">授信期限</div>
          <div class="detail-value">${project.term}个月</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">利率</div>
          <div class="detail-value">${project.rate}%</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">担保方式</div>
          <div class="detail-value">${this.getGuaranteeTypeText(project.guaranteeType)}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">状态</div>
          <div class="detail-value"><span class="status-badge ${project.status}">${this.getStatusText(project.status)}</span></div>
        </div>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h4 style="margin-bottom: 16px; font-size: 14px; color: var(--text-light);">时间信息</h4>
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-label">动拨日期</div>
          <div class="detail-value">${project.drawDate || '待确定'}</div>
        </div>
        <div class="detail-item">
          <div class="detail-label">贷后任务日期</div>
          <div class="detail-value">
            ${postLoanDates.length > 0 ? postLoanDates.map((d, i) => `<span style="margin-right:8px;">第${i+1}次: ${d}</span>`).join('<br>') : '待设置'}
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 24px;">
      <h4 style="margin-bottom: 16px; font-size: 14px; color: var(--text-light);">任务清单</h4>
      <ul class="task-list">
${[...project.tasks.filter(t => !t.completed), ...project.tasks.filter(t => t.completed)].map(t => {
  const taskCustomer = t.customerId ? this.data.customers.find(c => c.customerNo === t.customerId) : null;
  const customerLabel = taskCustomer ? `<span style="font-size:11px;color:var(--text-light);margin-left:8px;">[${taskCustomer.name}${taskCustomer.customerNo ? ' ' + taskCustomer.customerNo : ''}]</span>` : '';
    return `
        <li class="task-item">
          <div class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="App.toggleTask('${t.id}', '${project.id}')">
            ${t.completed ? '✓' : ''}
          </div>
          <div class="task-content">
            <div class="task-title ${t.completed ? 'checked' : ''}">${t.title}${customerLabel}</div>
          </div>
        </li>
        `;
    }).join('')}
      </ul>
    </div>

    <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: flex-end;">
      <button class="btn btn-secondary" onclick="App.editProject('${project.id}'); App.closeModal('detailModal');">编辑项目</button>
      ${project.status !== 'completed' ? `<button class="btn btn-primary" onclick="App.updateProjectStatus('${project.id}')">推进流程</button>` : ''}
    </div>
    `;

    document.getElementById('detailContent').innerHTML = detailContent;
    document.getElementById('detailModal').classList.add('active');
  },

      editProject(id) {
        const project = this.data.projects.find(p => p.id === id);
        if (project) this.openProjectModal(project);
      },

      toggleTask(taskId, projectId) {
        if (!projectId) {
          for (const p of this.data.projects) {
            const task = p.tasks.find(t => t.id == taskId);
            if (task) { projectId = p.id; break; }
          }
        }

        const project = this.data.projects.find(p => p.id === projectId);
        if (!project) return;

        const task = project.tasks.find(t => t.id == taskId);
        if (task) {
          task.completed = !task.completed;
          this.saveData();
          this.render();
        }
      },

      updateProjectStatus(id) {
        const project = this.data.projects.find(p => p.id === id);
        if (!project) return;

        if (project.stage === 'pre') {
          project.stage = 'mid';
          project.stageProgress.pre = 100;
          project.stageProgress.mid = 0;
        } else if (project.stage === 'mid') {
          project.stage = 'post';
          project.stageProgress.mid = 100;
          project.stageProgress.post = 0;
        } else if (project.stage === 'post') {
          project.stage = 'post';
          project.stageProgress.post = 100;
          project.status = 'completed';
        }

        project.tasks = this.generateTasks(project.status, project.stage);
        let taskIndex = 0;
        if (project.stage === 'pre') taskIndex = 0;
        else if (project.stage === 'mid') taskIndex = 4;
        else taskIndex = 8;

        for (let i = 0; i < taskIndex && i < project.tasks.length; i++) {
          project.tasks[i].completed = true;
        }

        this.saveData();
        this.showProjectDetail(id);
        document.getElementById('notificationDot').style.display = 'none';
      },

navigateTo(page) {
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
  this.data.currentPage = page;
  this.render();
},

switchProjectTab(tab) {
  this.data.projectTab = tab;
  this.render();
},

      filterByStatus() {
        const filter = document.getElementById('statusFilter');
        this.data.filterStatus = filter.value;
        this.render();
      },

      filterByStage() {
        const filter = document.getElementById('stageFilter');
        this.data.filterStage = filter.value;
        this.render();
      },

      exportData() {
        const data = JSON.stringify(this.data.projects, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `credit-projects-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

exportProjectsXlsx() {
    const projects = this.getFilteredProjects();
    const headers = ['项目编号', '项目名称', '客户', '授信金额(万元)', '紧急度', '授信期限', '利率', '担保方式', '当前阶段', '状态', '创建时间', '动拨日期', '贷后任务日期'];
    const escape = (v) => {
      const s = String(v);
      return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [headers.map(escape).join(',')];
    projects.forEach(p => {
      const postLoanDates = (p.postLoanTaskDates || []).join('; ');
      const row = [
        escape(p.id),
        escape(p.name),
        escape((p.customerNames || []).join('; ')),
        escape((p.amount / 10000).toFixed(2)),
        escape(this.getUrgencyText(p.urgency)),
        escape(p.term + '个月'),
        escape(p.rate + '%'),
        escape(this.getGuaranteeTypeText(p.guaranteeType)),
        escape(this.getStageText(p.stage)),
        escape(this.getStatusText(p.status)),
        escape(this.formatDate(p.createdAt)),
        escape(p.drawDate || ''),
        escape(postLoanDates)
      ].join(',');
      rows.push(row);
    });
    const csv = rows.join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `信贷项目-${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  },

      importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const text = await file.text();
          try {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              this.data.projects = data;
              this.saveData();
              this.render();
              alert('导入成功');
            }
          } catch {
            alert('文件格式错误');
          }
        };
        input.click();
      },

      clearData() {
        if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
          this.data.projects = [];
          this.saveData();
          this.render();
        }
      },

      changePassword() {
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        const storedPassword = localStorage.getItem('creditPassword') || '';

        if (storedPassword && !current) {
          alert('请输入当前密码');
          return;
        }

        if (storedPassword && this.hashPassword(current) !== storedPassword) {
          alert('当前密码错误');
          return;
        }

        if (!newPass || newPass.length < 6) {
          alert('新密码至少需要6位');
          return;
        }

        if (newPass !== confirmPass) {
          alert('两次输入的密码不一致');
          return;
        }

        localStorage.setItem('creditPassword', this.hashPassword(newPass));
        alert('密码修改成功');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
      },

      hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
          hash = ((hash << 5) - hash) + password.charCodeAt(i);
          hash |= 0;
        }
        return hash.toString(16);
      },

      checkLogin() {
        const password = localStorage.getItem('creditPassword');
        if (!password) return true;

        const input = prompt('请输入密码：');
        return this.hashPassword(input || '') === password;
      },

      toggleSubMenu(event, menuId) {
        event.preventDefault();
        const menu = document.getElementById(menuId);
        const icon = document.getElementById(menuId + 'Icon');
        if (menu.style.display === 'none') {
          menu.style.display = 'block';
          if (icon) icon.textContent = '▲';
        } else {
          menu.style.display = 'none';
          if (icon) icon.textContent = '▼';
        }
      },

      showStage(stage) {
        this.data.filterStage = stage;
        this.data.currentPage = 'projects';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="projects"]')?.classList.add('active');
        this.render();
      },

      showAllProjects() {
        this.data.filterStage = '';
        this.data.currentPage = 'projects';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="projects"]')?.classList.add('active');
        this.render();
      },

      toggleSection(sectionId) {
        const el = document.getElementById(sectionId);
        const icon = document.getElementById(sectionId + 'Icon');
        if (el.style.display === 'none') {
          el.style.display = 'block';
          if (icon) icon.textContent = '▲';
        } else {
          el.style.display = 'none';
          if (icon) icon.textContent = '▼';
        }
      },

      filterByStatus(status) {
        this.data.filterStatus = status || '';
        this.data.currentPage = 'projects';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="projects"]')?.classList.add('active');
        this.render();
      },

      filterProjectByStatus(status) {
        this.filterByStatus(status);
      },

      filterProjectByStage(stage) {
        this.data.filterStage = stage || '';
        this.data.currentPage = 'projects';
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="projects"]')?.classList.add('active');
        this.render();
      },

toggleTaskSection(sectionId) {
const el = document.getElementById(sectionId);
let iconId = 'taskIcon' + sectionId.replace('taskSection', '').replace(/_/g, '');
if (sectionId.includes('custTaskSection')) {
iconId = 'custTaskIcon' + sectionId.replace('custTaskSection', '').replace(/_/g, '');
}
const icon = document.getElementById(iconId);
if (el.style.display === 'none') {
el.style.display = 'block';
if (icon) icon.textContent = '▼';
} else {
el.style.display = 'none';
if (icon) icon.textContent = '▶';
}
},

openDepositModal(deposit = null) {
        const isEdit = deposit != null;
        const content = document.getElementById('detailContent');
        document.getElementById('detailModal').classList.add('active');
        document.querySelector('#detailModal .modal-title').textContent = isEdit ? '编辑存款' : '新增存款';

        this.currentDepositSelectedCustomer = deposit ? [deposit.customerId] : [];

        document.getElementById('detailContent').innerHTML = `
<form style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px;">
  <div class="form-group">
    <label class="form-label">存款编号</label>
    <input type="text" class="form-input" id="depositId" value="${deposit ? deposit.id : ''}" ${isEdit ? 'readonly' : ''}>
  </div>
  <div class="form-group" style="grid-column: span 2;">
    <label class="form-label">客户 *（可多选）</label>
    <input type="text" class="form-input" id="depositCustomerSearch" placeholder="搜索客户..." oninput="App.filterDepositCustomers(this.value)" style="margin-bottom:8px;">
    <div id="depositCustomerList" style="max-height:150px;overflow-y:auto;border:1px solid var(--border);border-radius:4px;padding:8px;">
    </div>
  </div>
  <div class="form-group" style="grid-column: span 2;">
    <label class="form-label">已选客户</label>
    <div id="depositSelectedCustomers" style="display:flex;flex-wrap:wrap;gap:8px;min-height:32px;padding:8px;background:var(--bg);border-radius:4px;"></div>
  </div>
  <div class="form-group">
    <label class="form-label">产品名称</label>
    <input type="text" class="form-input" id="depositProductName" value="${deposit ? deposit.productName : ''}" placeholder="请输入产品名称">
  </div>
  <div class="form-group">
    <label class="form-label">存款类型 *</label>
    <select class="form-select" id="depositType" required>
      <option value="定期" ${deposit && deposit.type === '定期' ? 'selected' : ''}>定期</option>
      <option value="活期" ${deposit && deposit.type === '活期' ? 'selected' : ''}>活期</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">存款金额 *</label>
    <input type="number" class="form-input" id="depositAmount" value="${deposit ? deposit.amount : ''}" required min="0">
  </div>
  <div class="form-group">
    <label class="form-label">对客利率（%）</label>
    <input type="number" class="form-input" id="depositRate" value="${deposit ? deposit.rate : ''}" step="0.01">
  </div>
  <div class="form-group">
    <label class="form-label">FTP利率（%）</label>
    <input type="number" class="form-input" id="depositFtpRate" value="${deposit ? deposit.ftpRate : ''}" step="0.01">
  </div>
  <div class="form-group">
    <label class="form-label">存款日期</label>
    <input type="date" class="form-input" id="depositDate" value="${deposit ? deposit.date : ''}">
  </div>
  <div class="form-group">
    <label class="form-label">存款到期日</label>
    <input type="date" class="form-input" id="depositMaturityDate" value="${deposit ? deposit.maturityDate : ''}">
  </div>
</form>
<div style="margin-top:24px;display:flex;justify-content:flex-end;gap:12px;">
  <button class="btn btn-secondary" onclick="App.closeModal('detailModal')">取消</button>
  <button class="btn btn-primary" onclick="App.saveDeposit(${isEdit ? `'${deposit.id}'` : 'null'})">保存</button>
</div>
`;
        this.renderDepositCustomerList();
        this.updateDepositSelectedCustomers();
      },

      editDeposit(id) {
        const deposit = this.data.deposits.find(d => d.id === id);
        if (deposit) this.openDepositModal(deposit);
      },

saveDeposit(existingId) {
  const id = existingId || `D${String(this.data.deposits.length + 1).padStart(3, '0')}`;
  const customerId = this.currentDepositSelectedCustomer[0] || '';
  const customerName = this.data.customers.find(c => c.customerNo === customerId)?.name || '';
  const productName = document.getElementById('depositProductName').value || '';
  const type = document.getElementById('depositType').value;
  const amount = parseFloat(document.getElementById('depositAmount').value);
  const rate = parseFloat(document.getElementById('depositRate').value) || 0;
  const ftpRate = parseFloat(document.getElementById('depositFtpRate').value) || 0;
  const date = document.getElementById('depositDate').value || new Date().toISOString().split('T')[0];
  const maturityDate = document.getElementById('depositMaturityDate').value || '';

  if (!customerId || !amount) { alert('请填写必填字段'); return; }

  const depositData = { id, customerId, customerName, productName, type, amount, rate, ftpRate, date, maturityDate };
  if (existingId) {
          const idx = this.data.deposits.findIndex(d => d.id === existingId);
          this.data.deposits[idx] = depositData;
        } else {
          this.data.deposits.push(depositData);
        }

        this.saveData();
        this.closeModal('detailModal');
        this.render();
        alert('保存成功');
      },

      deleteDeposit(id) {
        if (confirm('确定要删除这条存款记录吗？')) {
          this.data.deposits = this.data.deposits.filter(d => d.id !== id);
          this.saveData();
          this.render();
        }
      },

      deleteProject(id) {
        if (confirm('确定要删除这个项目吗？')) {
          this.data.projects = this.data.projects.filter(p => p.id !== id);
          this.saveData();
          this.render();
        }
      },

      renderDurationBar(project) {
        const start = new Date(project.createdAt).getTime();
        const end = project.endDate ? new Date(project.endDate).getTime() : Date.now();
        const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const maxDays = 90;
        const percent = Math.min((days / maxDays) * 100, 100);
        const r = Math.min(255, Math.floor((percent / 100) * 255));
        const g = Math.min(255, Math.floor((1 - percent / 100) * 200 + 50));
        const color = `rgb(${r}, ${g}, 80)`;
        const color2 = project.endDate ? '#38a169' : color;
        return `
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="flex:1;height:16px;background:var(--border);border-radius:8px;overflow:hidden;max-width:80px;">
              <div style="width:${percent}%;height:100%;background:${color2};border-radius:8px;transition:width 0.3s;"></div>
            </div>
            <span style="font-size:12px;white-space:nowrap;">${days}天</span>
</div>
 `;
},

addOption(type) {
  const labels = {
    stages: '阶段',
    statuses: '状态',
    terms: '授信期限',
    guaranteeTypes: '担保方式',
    urgencies: '紧急度'
  };
  const value = prompt(`请输入${labels[type]}的值（英文标识）:`);
  if (!value) return;
  const label = prompt(`请输入${labels[type]}的显示名称:`);
  if (!label) return;

  if (this.data.options[type].find(o => o.value === value)) {
    alert('该值已存在');
    return;
  }

  this.data.options[type].push({ value, label });
  this.saveOptions();
  this.render();
},

editOption(type, value) {
  const option = this.data.options[type].find(o => o.value === value);
  if (!option) return;

  const newValue = prompt('修改值（英文标识）:', option.value);
  if (!newValue) return;
  const newLabel = prompt('修改显示名称:', option.label);
  if (!newLabel) return;

  if (newValue !== value && this.data.options[type].find(o => o.value === newValue)) {
    alert('该值已存在');
    return;
  }

  option.value = newValue;
  option.label = newLabel;
  this.saveOptions();
  this.render();
},

deleteOption(type, value) {
  if (!confirm('确定要删除这个选项吗？')) return;
  this.data.options[type] = this.data.options[type].filter(o => o.value !== value);
  this.saveOptions();
  this.render();
},

bindPageEvents() {}
};

document.addEventListener('DOMContentLoaded', () => App.init());

