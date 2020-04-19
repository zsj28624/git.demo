let components = [];
   
//供应商
components.push({ component: 'provider/Index', name: '', path: '/provider' })//供应商列表，查询，新建，编辑， 
//租户
components.push({ component: 'tenant/Index', name: '', path: '/tenant' })
components.push({ component: 'tenant/Edit', name: '', path: '/tenant/edit' })
//订单
components.push({ component: 'order/Index', name: '', path: '/order' })
components.push({ component: 'order/Exception', name: '', path: '/order/exception' })
components.push({ component: 'order/PayStream', name: '', path: '/order/payStream' })
//账号
components.push({ component: 'pay/Index', name: '', path: '/pay' })
components.push({ component: 'pay/Edit', name: '', path: '/pay/edit' })
components.push({ component: 'pay/TenantList', name: '', path: '/pay/tenantList' })
//支付页面
components.push({ component: 'payment/Index', name: '', path: '/payment' })
//统计汇总
components.push({ component: 'financial/payTotal/Index', name: '', path: '/financial/paytotal' })
//统计一
components.push({ component: 'report/Index', name: '', path: '/report/index' })


//2020-2-25后新增
//生态分类管理
components.push({ component: 'enterprise-ecology/ecology-type/Index', name:'' , path: '/ecologyType' })
//企业客户管理
components.push({ component: 'enterprise-ecology/corp/Index', name:'' , path: '/ecology/corp' })
components.push({ component: 'enterprise-ecology/corp/Edit', name:'' , path: '/ecology/corp/edit' })
components.push({ component: 'enterprise-ecology/corp/ecology/Index', name:'' , path: '/ecology/corp/ecology' })
components.push({ component: 'enterprise-ecology/corp/ecology/Edit', name:'' , path: '/ecology/corp/ecology/edit' })
components.push({ component: 'enterprise-ecology/corp/ecology/View', name:'' , path: '/ecology/corp/ecology/view' })
components.push({ component: 'enterprise-ecology/corp/Ability', name:'' , path: '/ecology/corp/ability' })
components.push({ component: 'enterprise-ecology/corp/track/Edit', name:'' , path: '/ecology/corp/track/edit' })
components.push({ component: 'enterprise-ecology/corp/certificate/Index', name:'' , path: '/ecology/corp/certificate' })
components.push({ component: 'enterprise-ecology/corp/TrainingRecord', name:'' , path: '/ecology/corp/trainingRecord' })
components.push({ component: 'enterprise-ecology/corp/BackgroundCheck', name:'' , path: '/ecology/corp/backgroundCheck' })
components.push({ component: 'enterprise-ecology/corp/trace/Edit', name:'' , path: '/ecology/corp/trace/edit' })
components.push({ component: 'enterprise-ecology/corp/trace/Index', name:'' , path: '/ecology/corp/trace/index' })
components.push({ component: 'enterprise-ecology/uncategorized/Index', name:'' , path: '/ecology/uncategorized' })
components.push({ component: 'enterprise-ecology/corp/myApply/Index', name:'' , path: '/ecology/corp/myApply' })
components.push({ component: 'enterprise-ecology/myecology/Index', name:'' , path: '/ecology/myecology' })

components.push({ component: 'enterprise-ecology/selcorp/Edit', name:'' , path: '/ecology/selcorp/edit' })
components.push({ component: 'enterprise-ecology/selcorp/ecology/Index', name:'' , path: '/ecology/selcorp/ecology' })
components.push({ component: 'enterprise-ecology/selcorp/Ability', name:'' , path: '/ecology/selcorp/ability' })
components.push({ component: 'enterprise-ecology/selcorp/certificate/Index', name:'' , path: '/ecology/selcorp/certificate' })
components.push({ component: 'enterprise-ecology/selcorp/trace/Index', name:'' , path: '/ecology/selcorp/trace/index' })
components.push({ component: 'enterprise-ecology/selcorp/TrainingRecord', name:'' , path: '/ecology/selcorp/trainingRecord' })
components.push({ component: 'enterprise-ecology/selcorp/BackgroundCheck', name:'' , path: '/ecology/selcorp/backgroundCheck' })

components.push({ component: 'enterprise-ecology/comment/Index', name:'' , path: '/ecology/comment/index' })

//生态业务审批
components.push({ component: 'enterprise-ecology/corp/audit/Index', name:'' , path: '/ecology/corp/audit' })
components.push({ component: 'enterprise-ecology/corp/audit/View', name:'' , path: '/ecology/corp/audit/view' })
components.push({ component: 'enterprise-ecology/corp/audit/Audit', name:'' , path: '/ecology/corp/audit/audit' })
components.push({ component: 'enterprise-ecology/corp/count/corpCount', name:'' , path: '/corpcount' })//数据统计

//产业园管理
components.push({ component: 'campus/campus/Index', name:'' , path: '/campus/campus' })
components.push({ component: 'campus/building/Index', name:'' , path: '/campus/building' })
components.push({ component: 'campus/room/Index', name:'' , path: '/campus/room' })
components.push({ component: 'campus/distribution/Index2', name:'' , path: '/campus/distribution' })
 
 //项目管理
components.push({ component: 'project/myproject/Index', name:'' , path: '/project/myproject' })//我的项目
components.push({ component: 'project/myproject/Edit', name:'' , path: '/project/myedit' })
components.push({ component: 'project/myproject/Import', name:'' , path: '/project/myimport' })
components.push({ component: 'project/myproject/Sign', name:'' , path: '/project/mysign' })
components.push({ component: 'project/myproject/trace', name:'' , path: '/project/mytrace' })
components.push({ component: 'project/myproject/traceEdit', name:'' , path: '/project/mytraceedit' })
components.push({ component: 'project/project/Index', name:'' , path: '/project/project' })//项目信息库
components.push({ component: 'project/project/Edit', name:'' , path: '/project/edit' })
components.push({ component: 'project/project/Import', name:'' , path: '/project/import' })
components.push({ component: 'project/project/Sign', name:'' , path: '/project/sign' })
components.push({ component: 'project/project/trace', name:'' , path: '/project/trace' })
components.push({ component: 'project/project/traceEdit', name:'' , path: '/project/traceedit' })
components.push({ component: 'project/settings/Index', name:'' , path: '/project/settings' })

components.push({ component: 'project/trace/trace', name:'' , path: '/project/trace/trace' })//项目跟进
components.push({ component: 'project/trace/traceEdit', name:'' , path: '/project/trace/traceedit' })

components.push({ component: 'project/audit/Index', name:'' , path: '/project/audit' })//项目审批
components.push({ component: 'project/audit/Edit', name:'' , path: '/project/audit/edit' })
components.push({ component: 'project/audit/View', name:'' , path: '/project/audit/view' })

components.push({ component: 'project/apply/Index', name:'' , path: '/project/apply' })//我的申请

components.push({ component: 'project/count/projectCount', name:'' , path: '/projectcount' })//项目数据统计

//跟进动态
components.push({ component: 'enterprise-ecology/trace/Index', name:'' , path: '/ecology/trace' })

//工作台
components.push({ component: 'worktable/EcologyDeptLeader', name:'' , path: '/worktable/ecologyDeptLeader' })
components.push({ component: 'worktable/EcologySalesperson', name:'' , path: '/worktable/ecologySalesperson' })
components.push({ component: 'boss/campusWorks/campusWorks', name:'' , path: '/campus/works' })//工作台-园区部门领导
components.push({ component: 'boss/campusWorks/campusPeopleWorks', name:'' , path: '/campus/peopleworks' })//工作台-产业销售人员
components.push({ component: 'boss/campusWorks/Edit', name:'' , path: '/campus/peopleworks/edit' })//工作台-产业销售人员-入库申请
components.push({ component: 'boss/campusWorks/Import', name:'' , path: '/campus/peopleworks/import' })//工作台-产业销售人员-重点项目申请
components.push({ component: 'boss/campusWorks/Sign', name:'' , path: '/campus/peopleworks/sign' })//工作台-产业销售人员-签约项目申请
components.push({ component: 'boss/Index', name:'boss' , path: '/worktable/boss' })//工作台-Boss

//全文检索
components.push({ component: 'retrievingAll/Retrieving', name:'' , path: '/retrievingAll' })
export default components;