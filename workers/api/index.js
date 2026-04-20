const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
        },
    });
}

function errorResponse(message, status = 400) {
    return jsonResponse({ error: message }, status);
}

async function getDb(env) {
    return env.DB;
}

function parseJsonField(jsonStr) {
    if (!jsonStr) return null;
    try {
        return JSON.parse(jsonStr);
    } catch {
        return jsonStr;
    }
}

function stringifyField(obj) {
    if (typeof obj === 'string') return obj;
    return JSON.stringify(obj);
}

const Router = {
    routes: [],

    register(method, path, handler) {
        this.routes.push({ method, path, handler });
    },

    async handle(request, env) {
        const url = new URL(request.url);
        const method = request.method;
        const path = url.pathname;

        for (const route of this.routes) {
            if (route.method === method && route.path === path) {
                return await route.handler(request, env, url);
            }
        }

        return errorResponse('Not Found', 404);
    }
};

Router.register('OPTIONS', '/', async (req, env) => {
    return new Response(null, { headers: corsHeaders });
});

Router.register('GET', '/init', async (req, env) => {
    const db = await getDb(env);

    const existingProjects = await db.prepare('SELECT COUNT(*) as count FROM projects').first();
    if (existingProjects.count > 0) {
        return jsonResponse({ message: 'Database already initialized' });
    }

    const sampleCustomers = [
        { customerNo: '20260001', name: '北京创新科技有限公司', accounts: ['6222021100012345678', '6222021100012345679'], type: 'enterprise', contact: '张总', phone: '13800138000', address: '北京市朝阳区建国路88号' },
        { customerNo: '20260002', name: '上海国际贸易集团', accounts: ['6222021100012345680'], type: 'enterprise', contact: '李经理', phone: '13800138001', address: '上海市浦东新区陆家嘴环路1000号' },
        { customerNo: '20260003', name: '深圳智能制造企业', accounts: ['6222021100012345681', '6222021100012345682'], type: 'enterprise', contact: '王总', phone: '13800138002', address: '深圳市南山区科技园南区高新南七道' },
        { customerNo: '20260004', name: '广州物流运输公司', accounts: ['6222021100012345683'], type: 'enterprise', contact: '刘总', phone: '13800138003', address: '广州市天河区珠江新城花城大道' },
        { customerNo: '20260005', name: '杭州电子商务有限公司', accounts: ['6222021100012345684', '6222021100012345685'], type: 'enterprise', contact: '陈总', phone: '13800138004', address: '杭州市滨江区网商路599号' },
        { customerNo: '20260006', name: '成都软件开发中心', accounts: ['6222021100012345686'], type: 'enterprise', contact: '赵总', phone: '13800138005', address: '成都市高新区天府大道中段666号' },
        { customerNo: '20260007', name: '武汉新能源科技集团', accounts: ['6222021100012345687', '6222021100012345688'], type: 'enterprise', contact: '孙总', phone: '13800138006', address: '武汉市光谷大道77号光谷金融港' },
        { customerNo: '20260008', name: '南京制造业集团', accounts: ['6222021100012345689'], type: 'enterprise', contact: '周总', phone: '13800138007', address: '南京市江宁区将军大道100号' },
        { customerNo: '20260009', name: '西安高新材料公司', accounts: ['6222021100012345690'], type: 'enterprise', contact: '吴总', phone: '13800138008', address: '西安市高新区科技二路65号' },
        { customerNo: '20260010', name: '重庆文化旅游投资', accounts: ['6222021100012345691', '6222021100012345692'], type: 'enterprise', contact: '郑总', phone: '13800138009', address: '重庆市渝中区解放碑步行街88号' },
        { customerNo: '20260011', name: '天津港口物流集团', accounts: ['6222021100012345693'], type: 'enterprise', contact: '冯总', phone: '13800138010', address: '天津市滨海新区港口一路88号' },
        { customerNo: '20260012', name: '苏州工业园区发展', accounts: ['6222021100012345694'], type: 'enterprise', contact: '陈总', phone: '13800138011', address: '苏州市工业园区星湖街328号' },
        { customerNo: '20260013', name: '青岛海洋工程集团', accounts: ['6222021100012345695', '6222021100012345696'], type: 'enterprise', contact: '褚总', phone: '13800138012', address: '青岛市黄岛区港口路888号' },
        { customerNo: '20260014', name: '大连船舶重工公司', accounts: ['6222021100012345697'], type: 'enterprise', contact: '卫总', phone: '13800138013', address: '大连市甘井子区大连湾街168号' },
        { customerNo: '20260015', name: '长沙智能装备制造', accounts: ['6222021100012345698'], type: 'enterprise', contact: '蒋总', phone: '13800138014', address: '长沙市高新区麓谷大道668号' },
        { customerNo: '20260016', name: '张三', accounts: ['6222021100012345699'], type: 'personal', phone: '13900139000', address: '北京市海淀区中关村大街1号' },
        { customerNo: '20260017', name: '李四', accounts: ['6222021100012345700', '6222021100012345701'], type: 'personal', phone: '13900139001', address: '上海市静安区南京西路1788号' },
        { customerNo: '20260018', name: '王五', accounts: ['6222021100012345702'], type: 'personal', phone: '13900139002', address: '深圳市福田区深南大道10088号' },
        { customerNo: '20260019', name: '赵六', accounts: ['6222021100012345703'], type: 'personal', phone: '13900139003', address: '广州市天河区天河路385号' },
        { customerNo: '20260020', name: '钱七', accounts: ['6222021100012345704', '6222021100012345705'], type: 'personal', phone: '13900139004', address: '杭州市西湖区文二路388号' },
    ];

    for (const c of sampleCustomers) {
        await db.prepare(
            'INSERT INTO customers (customerNo, name, accounts, type, contact, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(c.customerNo, c.name, JSON.stringify(c.accounts), c.type, c.contact || '', c.phone, c.address).run();
    }

    const sampleProjects = [];
    const customers = ['北京创新科技有限公司', '上海国际贸易集团', '深圳智能制造企业', '广州物流运输公司', '杭州电子商务有限公司', '成都软件开发中心', '武汉新能源科技集团', '南京制造业集团', '西安高新材料公司', '重庆文化旅游投资', '天津港口物流集团', '苏州工业园区发展', '青岛海洋工程集团', '大连船舶重工公司', '长沙智能装备制造', '张三', '李四', '王五', '赵六', '钱七'];
    const statuses = ['pending', 'processing', 'completed', 'rejected'];
    const stages = ['pre', 'mid', 'post'];
    const urgencies = ['normal', 'urgent', 'very_urgent'];
    const projectNames = ['流动资金贷款', '项目贷款', '设备采购贷款', '技术改造贷款', '扩建项目贷款', '研发项目贷款', '并购贷款', '周转贷款', '供应链金融', '信用贷款', '抵押贷款', '担保贷款', '质押贷款', '循环贷款', '固定资产贷款', '经营性贷款', '项目融资', '过桥贷款', '并购融资', '出口信贷'];

    for (let i = 0; i < 30; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const stage = status === 'completed' ? 'post' : stages[Math.floor(Math.random() * 3)];
        const amount = Math.floor(Math.random() * 15000000) + 500000;
        const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString();
        const customerName = customers[i % customers.length];
        const customerNo = `20260${String(1 + (i % 20)).padStart(3, '0')}`;
        const postLoanTaskDates = [
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        ];

        const stageProgress = { pre: 0, mid: 0, post: 0 };
        if (stage === 'pre') stageProgress.pre = Math.floor(Math.random() * 100);
        else if (stage === 'mid') { stageProgress.pre = 100; stageProgress.mid = Math.floor(Math.random() * 100); }
        else { stageProgress.pre = 100; stageProgress.mid = 100; stageProgress.post = Math.floor(Math.random() * 100); }

        const project = {
            id: `PRJ${String(2026001 + i).padStart(6, '0')}`,
            name: `${projectNames[i % projectNames.length]}-${customerName}`,
            customerIds: [customerNo],
            customerNames: [customerName],
            customerType: i % 3 === 0 ? 'enterprise' : 'personal',
            amount,
            term: [3, 6, 12, 24, 36][Math.floor(Math.random() * 5)],
            rate: (Math.random() * 3 + 3.5).toFixed(2),
            guaranteeType: ['credit', 'mortgage', 'pledge', 'guarantee'][Math.floor(Math.random() * 4)],
            status,
            stage,
            urgency: urgencies[Math.floor(Math.random() * 3)],
            stageProgress,
            remark: '',
            createdAt,
            endDate: status === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
            drawDate: stage === 'mid' || stage === 'post' ? new Date(new Date(createdAt).getTime() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : '',
            postLoanTaskDates,
            tasks: [],
        };

        sampleProjects.push(project);
    }

    for (const p of sampleProjects) {
        await db.prepare(
            'INSERT INTO projects (id, name, customerIds, customerNames, customerType, amount, term, rate, guaranteeType, status, stage, urgency, stageProgress, remark, createdAt, endDate, drawDate, postLoanTaskDates, tasks, customerNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
            p.id, p.name, JSON.stringify(p.customerIds), JSON.stringify(p.customerNames), p.customerType,
            p.amount, p.term, p.rate, p.guaranteeType, p.status, p.stage, p.urgency,
            JSON.stringify(p.stageProgress), p.remark, p.createdAt, p.endDate, p.drawDate,
            JSON.stringify(p.postLoanTaskDates), JSON.stringify(p.tasks), p.customerIds[0]
        ).run();
    }

    const sampleDeposits = [
        { id: 'D001', customerId: '20260001', customerName: '北京创新科技有限公司', amount: 5000000, type: '定期', productName: '定期存款A款', date: '2025-01-15', rate: 2.1, ftpRate: 1.5, maturityDate: '2026-01-15' },
        { id: 'D002', customerId: '20260002', customerName: '上海国际贸易集团', amount: 8000000, type: '活期', productName: '活期结算账户', date: '2025-02-20', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
        { id: 'D003', customerId: '20260003', customerName: '深圳智能制造企业', amount: 3000000, type: '定期', productName: '定期存款B款', date: '2025-03-10', rate: 2.25, ftpRate: 1.6, maturityDate: '2026-03-10' },
        { id: 'D004', customerId: '20260004', customerName: '广州物流运输公司', amount: 2000000, type: '活期', productName: '活期结算账户', date: '2025-03-25', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
        { id: 'D005', customerId: '20260005', customerName: '杭州电子商务有限公司', amount: 6000000, type: '定期', productName: '定期存款A款', date: '2025-04-05', rate: 2.15, ftpRate: 1.5, maturityDate: '2026-04-05' },
        { id: 'D006', customerId: '20260001', customerName: '北京创新科技有限公司', amount: 1500000, type: '活期', productName: '活期结算账户', date: '2025-04-18', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
        { id: 'D007', customerId: '20260016', customerName: '张三', amount: 500000, type: '定期', productName: '定期存款B款', date: '2025-05-01', rate: 2.3, ftpRate: 1.65, maturityDate: '2026-05-01' },
        { id: 'D008', customerId: '20260017', customerName: '李四', amount: 300000, type: '活期', productName: '活期结算账户', date: '2025-05-10', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
        { id: 'D009', customerId: '20260006', customerName: '成都软件开发中心', amount: 4500000, type: '定期', productName: '定期存款C款', date: '2025-06-01', rate: 2.2, ftpRate: 1.55, maturityDate: '2026-06-01' },
        { id: 'D010', customerId: '20260007', customerName: '武汉新能源科技集团', amount: 12000000, type: '活期', productName: '活期结算账户', date: '2025-06-15', rate: 0.35, ftpRate: 0.2, maturityDate: '' },
    ];

    for (const d of sampleDeposits) {
        await db.prepare(
            'INSERT INTO deposits (id, customerId, customerName, productName, type, amount, rate, ftpRate, date, maturityDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(d.id, d.customerId, d.customerName, d.productName, d.type, d.amount, d.rate, d.ftpRate, d.date, d.maturityDate).run();
    }

    const today = new Date();
    const sampleTasks = [
        { id: 'T001', title: '客户尽职调查', customerNo: '20260001', dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: 0 },
        { id: 'T002', title: '资料收集与核实', customerNo: '20260001', dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: 0 },
        { id: 'T003', title: '信用评估报告', customerNo: '20260002', dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: 0 },
        { id: 'T004', title: '实地考察', customerNo: '20260003', dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: 0 },
        { id: 'T005', title: '初审评估', customerNo: '20260002', dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], completed: 1 },
    ];

    for (const t of sampleTasks) {
        await db.prepare(
            'INSERT INTO tasks (id, title, customerNo, dueDate, completed) VALUES (?, ?, ?, ?, ?)'
        ).bind(t.id, t.title, t.customerNo, t.dueDate, t.completed).run();
    }

    const defaultOptions = {
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
    };

    for (const [key, value] of Object.entries(defaultOptions)) {
        await db.prepare('INSERT INTO options (key, value) VALUES (?, ?)').bind(key, JSON.stringify(value)).run();
    }

    return jsonResponse({ message: 'Database initialized with sample data' });
});

Router.register('POST', '/auth/login', async (req, env) => {
    try {
        const { password } = await req.json();
        const storedPassword = env.API_PASSWORD || 'admin123';

        if (password === storedPassword) {
            return jsonResponse({ success: true, token: 'authenticated' });
        }
        return errorResponse('Invalid password', 401);
    } catch {
        return errorResponse('Invalid request');
    }
});

Router.register('GET', '/options', async (req, env) => {
    const db = await getDb(env);
    const result = await db.prepare('SELECT key, value FROM options').all();
    const options = {};
    for (const row of result.results) {
        options[row.key] = parseJsonField(row.value);
    }
    return jsonResponse(options);
});

Router.register('PUT', '/options', async (req, env) => {
    try {
        const { key, value } = await req.json();
        if (!key || !value) {
            return errorResponse('Missing key or value');
        }
        const db = await getDb(env);
        await db.prepare('INSERT OR REPLACE INTO options (key, value) VALUES (?, ?)').bind(key, stringifyField(value)).run();
        return jsonResponse({ success: true });
    } catch {
        return errorResponse('Invalid request');
    }
});

Router.register('GET', '/projects', async (req, env) => {
    const db = await getDb(env);
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const stage = url.searchParams.get('stage');

    let query = 'SELECT * FROM projects WHERE 1=1';
    const bindings = [];

    if (status) {
        query += ' AND status = ?';
        bindings.push(status);
    }
    if (stage) {
        query += ' AND stage = ?';
        bindings.push(stage);
    }

    query += ' ORDER BY createdAt DESC';
    const result = await db.prepare(query).bind(...bindings).all();

    const projects = result.results.map(row => ({
        ...row,
        customerIds: parseJsonField(row.customerIds),
        customerNames: parseJsonField(row.customerNames),
        stageProgress: parseJsonField(row.stageProgress),
        postLoanTaskDates: parseJsonField(row.postLoanTaskDates),
        tasks: parseJsonField(row.tasks),
    }));

    return jsonResponse(projects);
});

Router.register('POST', '/projects', async (req, env) => {
    try {
        const project = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            INSERT INTO projects (id, name, customerIds, customerNames, customerType, amount, term, rate, guaranteeType, status, stage, urgency, stageProgress, remark, createdAt, endDate, drawDate, postLoanTaskDates, tasks, customerNo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            project.id, project.name, stringifyField(project.customerIds), stringifyField(project.customerNames),
            project.customerType, project.amount, project.term, project.rate, project.guaranteeType,
            project.status, project.stage, project.urgency, stringifyField(project.stageProgress),
            project.remark || '', project.createdAt, project.endDate, project.drawDate,
            stringifyField(project.postLoanTaskDates), stringifyField(project.tasks), project.customerIds?.[0] || ''
        ).run();

        return jsonResponse({ success: true, id: project.id });
    } catch (e) {
        return errorResponse('Failed to create project: ' + e.message);
    }
});

Router.register('PUT', '/projects/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const project = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            UPDATE projects SET name = ?, customerIds = ?, customerNames = ?, customerType = ?, amount = ?, term = ?, rate = ?, guaranteeType = ?, status = ?, stage = ?, urgency = ?, stageProgress = ?, remark = ?, createdAt = ?, endDate = ?, drawDate = ?, postLoanTaskDates = ?, tasks = ?, customerNo = ?
            WHERE id = ?
        `).bind(
            project.name, stringifyField(project.customerIds), stringifyField(project.customerNames),
            project.customerType, project.amount, project.term, project.rate, project.guaranteeType,
            project.status, project.stage, project.urgency, stringifyField(project.stageProgress),
            project.remark || '', project.createdAt, project.endDate, project.drawDate,
            stringifyField(project.postLoanTaskDates), stringifyField(project.tasks), project.customerIds?.[0] || '', id
        ).run();

        return jsonResponse({ success: true });
    } catch (e) {
        return errorResponse('Failed to update project: ' + e.message);
    }
});

Router.register('DELETE', '/projects/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const db = await getDb(env);
        await db.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true });
    } catch {
        return errorResponse('Failed to delete project');
    }
});

Router.register('GET', '/customers', async (req, env) => {
    const db = await getDb(env);
    const result = await db.prepare('SELECT * FROM customers ORDER BY customerNo').all();
    const customers = result.results.map(row => ({
        ...row,
        accounts: parseJsonField(row.accounts),
    }));
    return jsonResponse(customers);
});

Router.register('POST', '/customers', async (req, env) => {
    try {
        const customer = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            INSERT INTO customers (customerNo, name, accounts, type, contact, phone, address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
            customer.customerNo, customer.name, stringifyField(customer.accounts || []),
            customer.type, customer.contact || '', customer.phone || '', customer.address || ''
        ).run();

        return jsonResponse({ success: true, customerNo: customer.customerNo });
    } catch (e) {
        return errorResponse('Failed to create customer: ' + e.message);
    }
});

Router.register('PUT', '/customers/:customerNo', async (req, env, url) => {
    try {
        const customerNo = url.pathname.split('/').pop();
        const customer = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            UPDATE customers SET name = ?, accounts = ?, type = ?, contact = ?, phone = ?, address = ?
            WHERE customerNo = ?
        `).bind(
            customer.name, stringifyField(customer.accounts || []),
            customer.type, customer.contact || '', customer.phone || '', customer.address || '', customerNo
        ).run();

        return jsonResponse({ success: true });
    } catch (e) {
        return errorResponse('Failed to update customer: ' + e.message);
    }
});

Router.register('DELETE', '/customers/:customerNo', async (req, env, url) => {
    try {
        const customerNo = url.pathname.split('/').pop();
        const db = await getDb(env);
        await db.prepare('DELETE FROM customers WHERE customerNo = ?').bind(customerNo).run();
        return jsonResponse({ success: true });
    } catch {
        return errorResponse('Failed to delete customer');
    }
});

Router.register('GET', '/deposits', async (req, env) => {
    const db = await getDb(env);
    const result = await db.prepare('SELECT * FROM deposits ORDER BY date DESC').all();
    return jsonResponse(result.results);
});

Router.register('POST', '/deposits', async (req, env) => {
    try {
        const deposit = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            INSERT INTO deposits (id, customerId, customerName, productName, type, amount, rate, ftpRate, date, maturityDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            deposit.id, deposit.customerId, deposit.customerName, deposit.productName || '',
            deposit.type, deposit.amount, deposit.rate || 0, deposit.ftpRate || 0,
            deposit.date, deposit.maturityDate || ''
        ).run();

        return jsonResponse({ success: true, id: deposit.id });
    } catch (e) {
        return errorResponse('Failed to create deposit: ' + e.message);
    }
});

Router.register('PUT', '/deposits/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const deposit = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            UPDATE deposits SET customerId = ?, customerName = ?, productName = ?, type = ?, amount = ?, rate = ?, ftpRate = ?, date = ?, maturityDate = ?
            WHERE id = ?
        `).bind(
            deposit.customerId, deposit.customerName, deposit.productName || '',
            deposit.type, deposit.amount, deposit.rate || 0, deposit.ftpRate || 0,
            deposit.date, deposit.maturityDate || '', id
        ).run();

        return jsonResponse({ success: true });
    } catch (e) {
        return errorResponse('Failed to update deposit: ' + e.message);
    }
});

Router.register('DELETE', '/deposits/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const db = await getDb(env);
        await db.prepare('DELETE FROM deposits WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true });
    } catch {
        return errorResponse('Failed to delete deposit');
    }
});

Router.register('GET', '/tasks', async (req, env) => {
    const db = await getDb(env);
    const url = new URL(req.url);
    const customerNo = url.searchParams.get('customerNo');
    const completed = url.searchParams.get('completed');

    let query = 'SELECT * FROM tasks WHERE 1=1';
    const bindings = [];

    if (customerNo) {
        query += ' AND customerNo = ?';
        bindings.push(customerNo);
    }
    if (completed !== null) {
        query += ' AND completed = ?';
        bindings.push(completed === 'true' ? 1 : 0);
    }

    query += ' ORDER BY dueDate ASC';
    const result = await db.prepare(query).bind(...bindings).all();

    const tasks = result.results.map(row => ({
        ...row,
        completed: row.completed === 1,
    }));

    return jsonResponse(tasks);
});

Router.register('POST', '/tasks', async (req, env) => {
    try {
        const task = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            INSERT INTO tasks (id, title, customerNo, dueDate, completed)
            VALUES (?, ?, ?, ?, ?)
        `).bind(
            task.id, task.title, task.customerNo || '', task.dueDate || '', task.completed ? 1 : 0
        ).run();

        return jsonResponse({ success: true, id: task.id });
    } catch (e) {
        return errorResponse('Failed to create task: ' + e.message);
    }
});

Router.register('PUT', '/tasks/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const task = await req.json();
        const db = await getDb(env);

        await db.prepare(`
            UPDATE tasks SET title = ?, customerNo = ?, dueDate = ?, completed = ?
            WHERE id = ?
        `).bind(
            task.title, task.customerNo || '', task.dueDate || '', task.completed ? 1 : 0, id
        ).run();

        return jsonResponse({ success: true });
    } catch (e) {
        return errorResponse('Failed to update task: ' + e.message);
    }
});

Router.register('DELETE', '/tasks/:id', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const db = await getDb(env);
        await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
        return jsonResponse({ success: true });
    } catch {
        return errorResponse('Failed to delete task');
    }
});

Router.register('PUT', '/tasks/:id/toggle', async (req, env, url) => {
    try {
        const id = url.pathname.split('/').pop();
        const db = await getDb(env);

        const task = await db.prepare('SELECT completed FROM tasks WHERE id = ?').bind(id).first();
        if (!task) {
            return errorResponse('Task not found', 404);
        }

        await db.prepare('UPDATE tasks SET completed = ? WHERE id = ?').bind(task.completed ? 0 : 1, id).run();
        return jsonResponse({ success: true, completed: !task.completed });
    } catch {
        return errorResponse('Failed to toggle task');
    }
});

async function handleRequest(request, env) {
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    return Router.handle(request, env);
}

export default {
    fetch(request, env) {
        return handleRequest(request, env);
    }
};
