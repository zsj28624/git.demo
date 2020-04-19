let components = [];

components.push({ component: 'Index', name: 'index', path: '/' })
components.push({ component: 'login/Login', name: 'login', path: '/login' })
components.push({ component: 'contacts/Contacts', name: 'contacts', path: '/contacts' })
components.push({ component: 'contacts/Sync', name: 'contacts.sync', path: '/contacts/sync' })
components.push({ component: 'contacts/BatchOper', name: 'contacts.batch', path: '/contacts/batch' })

components.push({ component: 'frame/ChangePwd', name: 'frm.chgpwd', path: '/chgpwd' })
components.push({ component: 'frame/AccountSet', name: 'frm.accset', path: '/accset' })
components.push({ component: 'frame/Admin', name: 'frm.admin', path: '/admin' })
components.push({ component: 'frame/Role', name: 'frm.role', path: '/role' })
components.push({ component: 'frame/Message', name: '', path: '/message' })
components.push({ component: 'frame/setting', name: '', path: '/setting' })
components.push({ component: 'frame/RoleUser', name: '', path: '/roleuser' })
components.push({ component: 'frame/LoginInfoChg', name: 'frm.loginInfoChg', path: '/myinfo' })

components.push({ component: 'powermenu/Index', name:'' , path: '/powermenu' })

components.push({ component: 'sysinfo/Index', name: '', path: '/sysinfo' });
components.push({ component: 'arg/Index', name: '', path: '/arg' });

components.push({ component: 'demo/Index', name: 'demo', path: '/demo' })
components.push({ component: 'demo/Tree', name: 'demo.tree', path: '/demo/tree' })
components.push({ component: 'demo/DeptTree', name: 'demo.depttree', path: '/demo/depttree' })
components.push({ component: 'demo/SmallComponent', name: 'demo.small', path: '/demo/small' })
components.push({ component: 'demo/Layout', name: 'demo.layout', path: '/demo/layout' })
components.push({ component: 'demo/SelContacts', name: 'demo.selcontacts', path: '/demo/selcontacts' })
components.push({ component: 'demo/SelOther', name: 'demo.selother', path: '/demo/selother' })
components.push({ component: 'demo/SelPersonBatch', name: 'demo.selpersonbatch', path: '/demo/selpersonbatch' }) 
components.push({ component: 'demo/echarts', name: 'demo.echarts', path: '/demo/echarts' })

components.push({ component: 'engine/api/ApiList',path: '/engine/api' })
components.push({ component: 'engine/dbtable/DbList',path: '/engine/db' })

components.push({ component: 'info/develop',path: '/develop' })
// 系统日志
components.push({ component: 'logger/Index', name: '', path: '/logger' }) 
export default components;