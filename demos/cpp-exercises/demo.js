/* Separate 2026 browser adaptations of archived 2023/24 C++ group exercises.
   The original C++ code was not replaced or retroactively attributed to one author. */
(() => {
  'use strict';
  const de = () => document.documentElement.lang === 'de';
  const messages = (en, german) => de() ? german : en;
  const values = new Map(Object.entries({
    'null': 0, 'ein':1, 'eins':1, 'zwei':2, 'drei':3,
    'vier':4, 'fuenf':5, 'fünf':5, 'sechs':6,
    'sieben':7, 'acht':8, 'neun':9, 'zehn':10
  }));
  const operations = new Map([
    ['plus', (a,b) => a+b], ['minus', (a,b) => a-b],
    ['mal', (a,b) => a*b], ['geteilt-durch', (a,b) => Math.trunc(a/b)],
    ['dividiert-durch', (a,b) => a/b]
  ]);

  // Pure calculation functions are exposed only for deterministic local unit tests.
  function calculate(expression) {
    const parts = expression.trim().toLocaleLowerCase('de-DE').split(/\s+/);
    if (parts.length !== 3) throw Error('words');
    if (!values.has(parts[0]) || !values.has(parts[2])) throw Error('number');
    if (!operations.has(parts[1])) throw Error('operation');
    const a=values.get(parts[0]), b=values.get(parts[2]);
    if (b===0 && (parts[1]==='geteilt-durch'||parts[1]==='dividiert-durch')) throw Error('zero');
    return operations.get(parts[1])(a,b);
  }
  function bubbleSort(input) {
    const parts=input.split(',').map(x=>x.trim());
    if (parts.length !== 3 || parts.some(x => !/^-?\d+$/.test(x))) throw Error('three');
    const a=parts.map(Number);
    if (a.some(v => !Number.isSafeInteger(v))) throw Error('range');
    const steps=[];
    for(let i=0;i<a.length-1;i++) {
      for(let j=0;j<a.length-1-i;j++) {
        const before=[...a],swap=a[j]>a[j+1];
        if(swap) [a[j],a[j+1]]=[a[j+1],a[j]];
        steps.push({pass:i+1,comparison:[before[j],before[j+1]],swap,after:[...a]});
      }
    }
    return {result:a,steps};
  }
  if(typeof module!=='undefined' && module.exports) module.exports={calculate,bubbleSort};
  if (typeof document === 'undefined') return;

  const tabs=Array.from(document.querySelectorAll('[data-demo-tab]'));
  const panels={calc:document.getElementById('panel-calc'),sort:document.getElementById('panel-sort')};
  function activate(id) {
    for(const tab of tabs) {
      const selected=tab.dataset.demoTab===id;
      tab.setAttribute('aria-selected',String(selected));
      tab.tabIndex=selected?0:-1;
    }
    for(const [key,panel] of Object.entries(panels)) if(panel) panel.hidden=key!==id;
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.demoTab));
    tab.addEventListener('keydown',ev=>{
      let next=i;
      if(ev.key==='ArrowRight') next=(i+1)%tabs.length;
      else if(ev.key==='ArrowLeft') next=(i+tabs.length-1)%tabs.length;
      else if(ev.key==='Home') next=0;
      else if(ev.key==='End') next=tabs.length-1;
      else return;
      ev.preventDefault();activate(tabs[next].dataset.demoTab);tabs[next].focus();
    });
  });
  const calcForm=document.getElementById('calc-form'),out=document.getElementById('calc-output'),history=document.getElementById('calc-history');
  const friendly = err => ({
    words:messages('Enter exactly three words.','Gib genau drei Wörter ein.'),
    number:messages('Use German number words from null to zehn.','Verwende deutsche Zahlwörter von null bis zehn.'),
    operation:messages('Use plus, minus, mal, geteilt-durch or dividiert-durch.','Nutze plus, minus, mal, geteilt-durch oder dividiert-durch.'),
    zero:messages('Division by zero is not allowed.','Division durch null ist nicht erlaubt.')
  })[err.message]||messages('Invalid expression.','Ungültiger Ausdruck.');
  calcForm?.addEventListener('submit',ev=>{
    ev.preventDefault();
    const expression=document.getElementById('expression').value.trim();
    try {
      const result=calculate(expression);
      out.classList.remove('is-error');out.textContent=`${expression} = ${result}`;
      const li=document.createElement('li');li.textContent=`${expression} = ${result}`;history.prepend(li);
      while(history.children.length>5) history.lastElementChild.remove();
    } catch(e) {out.classList.add('is-error');out.textContent=friendly(e);}
  });
  const sortForm=document.getElementById('sort-form'),visual=document.getElementById('sort-visual'),stepsList=document.getElementById('sort-steps');
  function showSort(values) {visual.replaceChildren();for(const val of values){const item=document.createElement('span');item.className='sort-pill';item.textContent=String(val);visual.append(item);}}
  sortForm?.addEventListener('submit',ev=>{
    ev.preventDefault();stepsList.replaceChildren();
    try {
      const data=bubbleSort(document.getElementById('sort-values').value);
      showSort(data.result);
      for(const step of data.steps){
        const li=document.createElement('li');
        li.textContent=`${messages('Pass','Durchlauf')} ${step.pass}: ${step.comparison.join(' / ')} — ${step.swap?messages('swap','tauschen'):messages('keep','beibehalten')} → ${step.after.join(', ')}`;
        stepsList.append(li);
      }
    } catch(e){visual.replaceChildren();const message=document.createElement('p');message.textContent=messages('Enter exactly three whole numbers separated by commas.','Gib genau drei ganze Zahlen ein, durch Kommas getrennt.');visual.append(message);}
  });
  document.addEventListener('notedbit:languagechange',()=>{
    if(out&&!out.classList.contains('is-error')&&!history.children.length) out.textContent=messages('Enter an expression and select Calculate.','Gib einen Ausdruck ein und drücke Berechnen.');
  });
  showSort([9,2,5]);
})();
