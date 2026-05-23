import { useState, useMemo } from 'react';
import { X, Eye } from 'lucide-react';
import { buildContractBody, newContractId } from '../utils/contracts.js';
import { formatVND } from '../utils/format.js';
import ContractPreviewModal from './ContractPreviewModal.jsx';
import ContractDocument from './ContractDocument.jsx';

export default function ContractCreateModal({
  open,
  onClose,
  clients,
  projects,
  freelancers,
  templates,
  ownerName = 'ThompBui',
  initialType = 'client',
  prefillFreelancerId = '',
  onSave,
}) {
  const [formType, setFormType] = useState(initialType);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [clientId, setClientId] = useState('');
  const [freelancerId, setFreelancerId] = useState(prefillFreelancerId);
  const [projectId, setProjectId] = useState('');
  const [workScope, setWorkScope] = useState('- Phát triển module theo task được giao\n- Tham gia họp nội bộ 1 lần/tuần');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('50% khi ký, 50% khi nghiệm thu');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [useCustomBudget, setUseCustomBudget] = useState(false);
  const [customBudget, setCustomBudget] = useState('');

  const client = clients.find((c) => c.id === clientId);
  const freelancer = freelancers.find((f) => f.id === freelancerId);
  const project = projects.find((p) => p.id === projectId);
  const activeTemplate = templates?.[formType];
  const templateFormat = activeTemplate?.format ?? 'text';

  const previewBody = useMemo(() => {
    if (!activeTemplate?.content) return '';
    const date = new Date().toLocaleDateString('vi-VN');
    const asHtml = templateFormat === 'html';
    if (formType === 'client') {
      if (!client || !project) return '';
      const value = useCustomBudget && customBudget ? Number(customBudget) : project.budget;
      return buildContractBody(
        activeTemplate.content,
        {
          contract_id: 'DRAFT',
          current_date: date,
          client_company: client.company,
          client_name: client.name,
          client_email: client.email,
          client_phone: client.phone,
          project_name: project.name,
          project_value: formatVND(value || 0),
        },
        { asHtml },
      );
    }
    if (!freelancer || !project) return '';
    const amount = paymentAmount ? Number(paymentAmount) : 0;
    return buildContractBody(
      activeTemplate.content,
      {
        contract_id: 'DRAFT',
        current_date: date,
        owner_name: ownerName,
        freelancer_name: freelancer.name,
        freelancer_email: freelancer.email,
        freelancer_phone: freelancer.phone || '—',
        project_name: project.name,
        work_scope: workScope,
        payment_amount: formatVND(amount),
        payment_terms: paymentTerms,
        deadline: deadline || project.deadline,
      },
      { asHtml },
    );
  }, [
    formType,
    client,
    freelancer,
    project,
    workScope,
    paymentAmount,
    paymentTerms,
    deadline,
    useCustomBudget,
    customBudget,
    ownerName,
    activeTemplate,
    templateFormat,
  ]);

  const canPreview = formType === 'client' ? client && project : freelancer && project;

  const handleSave = () => {
    if (!canPreview || !previewBody) return;
    const id = newContractId(formType === 'client' ? 'HD' : 'HĐCT');
    const finalBody = previewBody.replace(/DRAFT/g, id.split('-').pop());
    const contract = {
      id,
      type: formType,
      clientId: formType === 'client' ? clientId : null,
      freelancerId: formType === 'freelancer' ? freelancerId : null,
      projectId,
      body: finalBody,
      bodyFormat: templateFormat,
      templateFileName: activeTemplate?.fileName,
      createdAt: new Date().toLocaleDateString('vi-VN'),
      title: formType === 'client' ? `HĐ khách — ${client?.name}` : `HĐ cộng tác — ${freelancer?.name}`,
      partyName: formType === 'client' ? client?.name : freelancer?.name,
      projectName: project?.name,
      rawValue:
        formType === 'client'
          ? useCustomBudget && customBudget
            ? Number(customBudget)
            : project?.budget
          : Number(paymentAmount) || 0,
    };
    onSave(contract);
    setShowFullPreview(false);
    onClose();
  };

  const clientProjects = projects.filter((p) => !clientId || p.clientId === clientId || p.type === 'partnership');
  const collabProjects = projects.filter((p) => p.memberIds?.includes(freelancer?.userId) || p.type === 'partnership');

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
            <div>
              <h3 className="text-lg font-bold text-white">Soạn hợp đồng</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mẫu: {activeTemplate?.fileName ?? 'Mặc định'} — điền biến tự động từ form
              </p>
            </div>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setFormType('client')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${formType === 'client' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Hợp đồng khách hàng
            </button>
            <button
              type="button"
              onClick={() => setFormType('freelancer')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${formType === 'freelancer' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/5' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Hợp đồng cộng tác viên
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
            <div className="lg:w-[340px] shrink-0 overflow-y-auto p-5 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-800">
              {formType === 'client' ? (
                <>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Khách hàng</label>
                    <select
                      value={clientId}
                      onChange={(e) => {
                        setClientId(e.target.value);
                        setProjectId('');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Chọn khách hàng</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.company}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Dự án</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Chọn dự án</option>
                      {clientProjects.filter((p) => p.type === 'client').map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input type="checkbox" checked={useCustomBudget} onChange={(e) => setUseCustomBudget(e.target.checked)} className="rounded border-slate-600" />
                    Giá trị tùy chỉnh (khác ngân sách dự án)
                  </label>
                  {useCustomBudget && (
                    <input
                      type="number"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      placeholder="VNĐ"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  )}
                  {project && !useCustomBudget && (
                    <p className="text-xs text-emerald-400">Ngân sách dự án: {formatVND(project.budget)}</p>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Cộng tác viên</label>
                    <select
                      value={freelancerId}
                      onChange={(e) => setFreelancerId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Chọn freelancer</option>
                      {freelancers.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} — {f.skills.join(', ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Dự án liên quan</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Chọn dự án</option>
                      {(freelancerId ? collabProjects : projects).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Phạm vi công việc</label>
                    <textarea
                      value={workScope}
                      onChange={(e) => setWorkScope(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white resize-none focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Thù lao (VNĐ)</label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="VD: 15000000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Thanh toán</label>
                    <input
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1.5">Hạn hoàn thành</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  disabled={!canPreview}
                  onClick={() => setShowFullPreview(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-600 text-slate-200 hover:bg-slate-800 disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={16} /> Xem trước toàn màn
                </button>
                <button
                  type="button"
                  disabled={!canPreview}
                  onClick={handleSave}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-40"
                >
                  Lưu hợp đồng
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-h-[280px] lg:min-h-0 bg-slate-200/80">
              <p className="text-xs text-slate-600 px-4 py-2 border-b border-slate-300 shrink-0 bg-slate-100">
                Xem trước — căn lề chuẩn văn bản
              </p>
              <div className="flex-1 overflow-y-auto p-4">
                {previewBody ? (
                  <ContractDocument content={previewBody} format={templateFormat} className="shadow-lg max-w-3xl mx-auto" />
                ) : (
                  <p className="text-center text-slate-500 text-sm py-16">Chọn đủ thông tin bên trái để xem trước hợp đồng.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ContractPreviewModal
        open={showFullPreview}
        title={formType === 'client' ? 'Hợp đồng khách hàng' : 'Hợp đồng cộng tác viên'}
        subtitle={project ? `${partyLabel(formType, client, freelancer)} · ${project.name}` : ''}
        body={previewBody}
        bodyFormat={templateFormat}
        typeLabel={formType === 'client' ? 'Khách hàng' : 'Cộng tác viên'}
        onClose={() => setShowFullPreview(false)}
        onSave={handleSave}
        saveLabel="Lưu & đóng"
      />
    </>
  );
}

function partyLabel(type, client, freelancer) {
  return type === 'client' ? client?.name : freelancer?.name;
}
