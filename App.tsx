
import React, { useState } from 'react';
import { InputOnly, TextAreaOnly } from './components/InputField';
import { SectionWrapper } from './components/SectionWrapper';
import { QuizField } from './components/QuizField';
import { ProgressBar } from './components/ProgressBar';
import { CustomModal } from './components/CustomModal';
import { VisualCaptcha } from './components/VisualCaptcha';
import { FormData } from './types';
import { sendNotification } from './services/notificationService';

const initialFormState: FormData = {
  nickname: '',
  discord: '',
  age: '',
  about: '',
  timeOnProject: '',
  hoursDaily: '',
  activeTime: '',
  previousModExp: '',
  expectations: '',
  duties: '',
  teamLimit: '',
  betterPvpAllowed: '',
  multiAccountAllowed: '',
  recordCheckAllowed: 'no', 
  deanonPunishment: '',
  weaknessPunishment: '',
  insultModPunishment: '',
  mentionAllowedProjects: '',
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'form'>('landing');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  
  // Captcha state
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const totalSteps = 5;

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleNumericInput = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleActiveTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 8) val = val.substring(0, 8);
    
    let h1 = val.substring(0, 2);
    let m1 = val.substring(2, 4);
    let h2 = val.substring(4, 6);
    let m2 = val.substring(6, 8);

    if (h1.length === 2 && parseInt(h1) > 23) h1 = '23';
    if (m1.length === 2 && parseInt(m1) > 59) m1 = '59';
    if (h2.length === 2 && parseInt(h2) > 23) h2 = '23';
    if (m2.length === 2 && parseInt(m2) > 59) m2 = '59';

    let formatted = '';
    if (h1) formatted += h1;
    if (m1) formatted += ':' + m1;
    if (h2) formatted += '-' + h2;
    if (m2) formatted += ':' + m2;
    
    setFormData(prev => ({ ...prev, activeTime: formatted }));
  };

  const handleQuizChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.nickname.trim() !== '' && formData.discord.trim() !== '' && formData.age.trim() !== '';
      case 2:
        return (
          formData.timeOnProject.trim() !== '' && 
          formData.hoursDaily.trim() !== '' && 
          formData.activeTime.length === 11 && 
          formData.about.trim() !== ''
        );
      case 3:
        return formData.weaknessPunishment !== '' && formData.mentionAllowedProjects !== '' && formData.insultModPunishment !== '';
      case 4:
        return (
          formData.teamLimit.length > 0 && 
          formData.betterPvpAllowed.length > 0 && 
          formData.multiAccountAllowed.length > 0
        );
      case 5:
        return (
          formData.expectations.trim() !== '' && 
          formData.duties.trim() !== '' && 
          formData.deanonPunishment !== '' &&
          isCaptchaVerified
        );
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      let errorMsg = "Пожалуйста, ответьте на все вопросы на текущем шаге, прежде чем продолжить.";
      if (currentStep === 2 && formData.activeTime.length < 11 && formData.activeTime.length > 0) {
        errorMsg = "Неверный формат времени. Используйте ЧЧ:ММ-ЧЧ:ММ (напр. 22:00-00:30)";
      }
      setModal({ isOpen: true, title: "Внимание", message: errorMsg });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) {
      if (!isCaptchaVerified) {
         setModal({ isOpen: true, title: "Ошибка", message: "Пожалуйста, подтвердите, что вы не робот." });
      } else {
         setModal({ isOpen: true, title: "Ошибка", message: "Анкета заполнена не полностью. Проверьте все вопросы." });
      }
      return;
    }

    setIsSubmitting(true);
    const success = await sendNotification(formData);
    if (success) {
      setIsSubmitted(true);
    } else {
      setModal({ isOpen: true, title: "Сбой отправки", message: "Не удалось отправить заявку. Пожалуйста, попробуйте еще раз." });
    }
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setCurrentStep(1);
    setIsCaptchaVerified(false);
    setIsSubmitted(false);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startApplication = () => {
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#050505] overlay-animate-show">
        <div className="max-w-md w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-10 text-center shadow-[0_0_60px_rgba(176,0,255,0.25)] modal-animate-show">
          <div className="w-20 h-20 bg-gradient-to-br from-[#6200ea] to-[#b000ff] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(176,0,255,0.4)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-brand font-bold mb-4 tracking-tight text-white uppercase">Успешно</h2>
          <p className="text-gray-400 mb-8 leading-relaxed font-medium">Ваша заявка принята и отправлена администрации NullX. Спасибо за проявленный интерес!</p>
          <button 
            type="button"
            onClick={handleReset} 
            className="w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] bg-gradient-to-r from-[#6200ea] to-[#b000ff] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(98,0,234,0.35)] text-white"
          >
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-start py-10 px-4 overlay-animate-show">
        <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#6200ea] opacity-[0.06] blur-[140px] pointer-events-none"></div>
        <div className="fixed bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#b000ff] opacity-[0.06] blur-[140px] pointer-events-none"></div>

        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-full mb-12 shadow-lg animate-float">
          <svg className="h-3.5 w-3.5 text-[#b000ff]" fill="currentColor" viewBox="0 0 20 20">
             <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
             <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">Официальный портал набора персонала</span>
        </div>

        <div className="text-center max-w-4xl mb-16 px-4">
          <h1 className="text-6xl md:text-[90px] font-brand font-extrabold tracking-tighter leading-[0.9] mb-4 uppercase">
            Null<span className="text-[#b000ff] ml-3">X</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200ea] to-[#b000ff]">Staff</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Помогаем игрокам крупнейшего Minecraft проекта решать технические вопросы,
            модерировать игровой процесс и создавать лучшую атмосферу для игры.
            Присоединяйся к команде профессионалов!
          </p>
          
          <button 
            onClick={startApplication}
            className="group relative inline-flex items-center justify-center px-12 py-6 bg-[#5865F2] hover:bg-[#4752c4] rounded-xl text-white font-bold uppercase tracking-wider text-xl md:text-2xl transition-all active:scale-95 shadow-[0_15px_50px_rgba(88,101,242,0.4)]"
          >
            Подать заявку
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-12 md:gap-24 mb-24 max-w-5xl">
          <div className="text-center group">
            <h3 className="text-5xl font-brand font-extrabold text-white mb-2 group-hover:text-[#6200ea] transition-colors">7</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Сотрудников</p>
          </div>
          <div className="text-center group">
            <h3 className="text-5xl font-brand font-extrabold text-white mb-2 group-hover:text-[#ff0095] transition-colors">24/7</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Режим работы</p>
          </div>
          <div className="text-center group">
            <h3 className="text-5xl font-brand font-extrabold text-white mb-2 group-hover:text-[#b000ff] transition-colors">1 000+</h3>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Игроков проекта</p>
          </div>
        </div>

        <div className="w-full max-w-6xl mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-brand font-extrabold uppercase mb-4 tracking-tight">О работе персонала</h2>
            <p className="text-gray-500 tracking-wider text-sm font-medium">Мы — команда профессионалов, которая ежедневно делает сервер лучше</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard 
              icon={<path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
              title="Быстрые ответы"
              desc="Отвечаем на обращения в кратчайшие сроки и помогаем новичкам освоиться."
            />
            <FeatureCard 
              icon={<path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
              title="Опытная команда"
              desc="Квалифицированные специалисты с глубоким знанием правил и механик проекта."
            />
            <FeatureCard 
              icon={<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
              title="Помощь 24/7"
              desc="Работаем круглосуточно для вашего комфорта и стабильности игрового мира."
            />
            <FeatureCard 
              icon={<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
              title="Справедливость"
              desc="Объективный подход к каждой ситуации и строгое соблюдение регламента сервера."
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 md:px-6 relative overflow-hidden flex flex-col items-center bg-[#050505] overlay-animate-show">
      <CustomModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ ...modal, isOpen: false })} 
        title={modal.title} 
        message={modal.message} 
      />

      <div className="fixed top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#6200ea] opacity-[0.04] blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-[#b000ff] opacity-[0.04] blur-[140px] pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10">
        <header className="text-center mb-10 animate-float flex flex-col items-center">
          <button 
            onClick={() => setView('landing')}
            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
          >
            <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-[10px] uppercase font-bold tracking-widest">Вернуться на главную</span>
          </button>

          <h1 className="text-6xl md:text-7xl font-brand font-extrabold tracking-tighter mb-2 select-none uppercase">
            Null<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6200ea] to-[#b000ff] ml-3">X</span>
          </h1>
          <div className="flex items-center justify-center gap-3 opacity-60">
             <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white"></span>
             <p className="text-white uppercase tracking-[0.3em] text-[10px] font-bold">Applications For Internships</p>
             <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white"></span>
          </div>
        </header>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <form onSubmit={handleSubmit} className="transition-opacity duration-1000">
          
          {currentStep === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <SectionWrapper title="Профиль" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Никнейм в Minecraft</label>
                    <InputOnly placeholder="Ваш ник..." value={formData.nickname} onChange={handleInputChange('nickname')} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Discord</label>
                    <InputOnly placeholder="user_tag" value={formData.discord} onChange={handleInputChange('discord')} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Возраст (Цифры)</label>
                    <InputOnly placeholder="17" type="text" value={formData.age} onChange={handleNumericInput('age')} required />
                  </div>
                </div>
              </SectionWrapper>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <SectionWrapper title="Активность" icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Как давно вы с нами?</label>
                    <InputOnly placeholder="Напр: полгода" value={formData.timeOnProject} onChange={handleInputChange('timeOnProject')} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Часов в сутки</label>
                      <InputOnly placeholder="8" type="text" value={formData.hoursDaily} onChange={handleNumericInput('hoursDaily')} required />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Время (ЧЧ:ММ-ЧЧ:ММ)</label>
                      <InputOnly placeholder="22:00-00:30" type="text" value={formData.activeTime} onChange={handleActiveTimeInput} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Расскажите о себе</label>
                    <TextAreaOnly placeholder="Ваши увлечения, черты характера..." value={formData.about} onChange={handleInputChange('about')} required />
                  </div>
                </div>
              </SectionWrapper>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
              <QuizField 
                question="Какое наказание за фразы 'ez', 'bezdar', 'slabak'?"
                selectedValue={formData.weaknessPunishment}
                onChange={handleQuizChange('weaknessPunishment')}
                options={[
                  { label: 'MUTE до 30 минут', value: 'mute_30' },
                  { label: 'Без наказания (это исключение)', value: 'no_punish' },
                  { label: 'BAN на 1 час', value: 'ban_1h' }
                ]}
              />
              <QuizField 
                question="Разрешено ли рекламировать FunTime или HolyWorld?"
                selectedValue={formData.mentionAllowedProjects}
                onChange={handleQuizChange('mentionAllowedProjects')}
                options={[
                  { label: 'Да, эти проекты являются исключением', value: 'yes' },
                  { label: 'Нет, это карается PERMBAN', value: 'no' }
                ]}
              />
              <QuizField 
                question="Наказание за прямое оскорбление модерации?"
                selectedValue={formData.insultModPunishment}
                onChange={handleQuizChange('insultModPunishment')}
                options={[
                  { label: 'MUTE до 1 дня', value: 'mute_1d' },
                  { label: 'MUTE 20 минут', value: 'mute_20' },
                  { label: 'WARN и предупреждение', value: 'warn' }
                ]}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
               <QuizField 
                question="Максимальное кол-во человек в команде?"
                selectedValue={formData.teamLimit}
                onChange={handleQuizChange('teamLimit')}
                options={[
                  { label: '3 человека', value: '3' },
                  { label: '5 человек', value: '5' },
                  { label: 'Лимита нет', value: 'none' }
                ]}
              />
              <QuizField 
                question="Разрешено ли использование мода BetterPvP?"
                selectedValue={formData.betterPvpAllowed}
                onChange={handleQuizChange('betterPvpAllowed')}
                options={[
                  { label: 'Разрешен', value: 'yes' },
                  { label: 'Запрещен (BAN до 30 дней)', value: 'no' }
                ]}
              />
              <QuizField 
                question="Разрешено ли иметь мультиаккаунт на разных ТГ?"
                selectedValue={formData.multiAccountAllowed}
                onChange={handleQuizChange('multiAccountAllowed')}
                options={[
                  { label: 'Да, разрешено', value: 'yes' },
                  { label: 'Нет, BAN на 30 дней', value: 'no' }
                ]}
              />
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-in slide-in-from-right-8 duration-500 space-y-4">
              <SectionWrapper title="Завершение">
                <div className="space-y-6">
                   <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Опыт модерации</label>
                    <TextAreaOnly placeholder="Где вы работали ранее?" value={formData.previousModExp} onChange={handleInputChange('previousModExp')} required />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Почему именно вы?</label>
                    <TextAreaOnly placeholder="Цели и ожидания..." value={formData.expectations} onChange={handleInputChange('expectations')} required />
                  </div>
                   <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 ml-1 font-bold">Обязанности</label>
                    <TextAreaOnly placeholder="Что должен делать стажёр?" value={formData.duties} onChange={handleInputChange('duties')} required />
                  </div>
                </div>
              </SectionWrapper>
              
              <QuizField 
                question="Наказание за деанон других игроков?"
                selectedValue={formData.deanonPunishment}
                onChange={handleQuizChange('deanonPunishment')}
                options={[
                  { label: 'BAN на 7 дней', value: 'ban_7' },
                  { label: 'PERMBAN', value: 'permban' },
                  { label: 'WARN', value: 'warn' }
                ]}
              />

              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Подтверждение безопасности</p>
                <VisualCaptcha onVerify={(val) => setIsCaptchaVerified(val)} />
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 py-4 bg-[#111] border border-[#1f1f1f] rounded-xl text-gray-400 font-extrabold uppercase tracking-widest text-[10px] hover:bg-[#1a1a1a] hover:text-white transition-all active:scale-95 shadow-lg"
              >
                Назад
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-[2] py-4 bg-gradient-to-r from-[#6200ea] to-[#b000ff] rounded-xl text-white font-extrabold uppercase tracking-widest text-[10px] hover:brightness-110 shadow-[0_10px_30px_rgba(98,0,234,0.3)] transition-all active:scale-95"
              >
                Далее
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isCaptchaVerified}
                className={`flex-[2] py-4 rounded-xl text-white font-extrabold uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-lg ${
                  isSubmitting || !isCaptchaVerified 
                  ? 'bg-gray-800 opacity-50 cursor-not-allowed border border-gray-700' 
                  : 'bg-gradient-to-r from-[#6200ea] to-[#b000ff] hover:brightness-110 shadow-[0_0_30px_rgba(176,0,255,0.45)]'
                }`}
              >
                {isSubmitting ? 'Загрузка...' : 'Подать заявку'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, desc }) => (
  <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8 hover:border-[#b000ff]/30 transition-all duration-300 group">
    <div className="w-12 h-12 bg-[#111] border border-[#1f1f1f] rounded-xl flex items-center justify-center mb-6 text-[#b000ff] group-hover:bg-[#b000ff] group-hover:text-white transition-all duration-300 shadow-md">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {icon}
      </svg>
    </div>
    <h3 className="text-lg font-brand font-bold text-white mb-3 tracking-tight group-hover:text-[#b000ff] transition-colors">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default App;
