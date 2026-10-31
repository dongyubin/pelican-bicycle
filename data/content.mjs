const SITE_URL = (process.env.SITE_URL || "https://pelican-bicycle.wwkejishe.top").replace(/\/+$/, "");

export const siteMeta = {
  url: SITE_URL,
  name: "Pelican Bicycle Benchmark",
  nameZh: "鹈鹕骑自行车基准",
  testedAt: "2026-10-27",
};

export const ui = {
  en: {
    nav: { leaderboard: "Leaderboard", compare: "Compare", prompt: "Prompt", method: "Method" },
    langSwitch: { label: "中文", hrefLang: "zh-CN" },
    cta: { start: "Start the race", board: "See the leaderboard", compare: "Compare runs", method: "Read the method" },
    labels: {
      bib: "Bib",
      rank: "Rank",
      model: "Model",
      vendor: "Vendor",
      score: "Score",
      total: "Total",
      outOf: "out of 25",
      tested: "Tested",
      access: "Access",
      prompt: "Prompt",
      run: "Run",
      next: "Next run",
      prev: "Previous run",
      back: "Back to the grid",
      openRaw: "Open raw file",
      download: "Download HTML",
      copy: "Copy",
      copied: "Copied",
      copyPrompt: "Copy prompt",
      copyTranslation: "Copy translation",
      clock: "Session clock",
      wrongPelican: "Wrong pelican?",
      play: "Play the run",
      fullscreen: "Fullscreen playback",
      exitFullscreen: "Exit fullscreen",
      reload: "Reload",
      pause: "Pause",
      resume: "Resume",
      startSync: "Start sync",
      restart: "Restart",
      loading: "Loading runs…",
      racing: "Racing",
      paused: "Paused",
      ready: "Ready",
      scoreBoard: "Scoreboard",
      rubric: "Rubric",
      updated: "Last updated",
      works: "What works",
      breaks: "What breaks",
      verdict: "Verdict",
      motion: "Motion check",
      spec: "Spec",
      compareThis: "Compare this run",
      downloadPrompt: "Download prompt",
      yes: "Yes",
      no: "No",
      partial: "Partial",
      allRuns: "All runs",
      editorial: "Editorial score, one run.",
    },
    footer: {
      tagline: "An animated extension of the pelican-on-a-bicycle LLM test.",
      credit: "Prompt lineage: Simon Willison, 2024.",
      note: "Model outputs are shown unmodified. Scores are editorial.",
      attribution: "Not affiliated with Little Tikes, Bicicapace or Box Dog Bikes. Model outputs remain the property of their respective owners.",
      rights: "Pelican Bicycle Benchmark · 2026",
      skip: "Skip to content",
      menu: "Menu",
    },
  },
  zh: {
    nav: { leaderboard: "榜单", compare: "并排对比", prompt: "提示词", method: "方法" },
    langSwitch: { label: "EN", hrefLang: "en" },
    cta: { start: "开始比赛", board: "查看榜单", compare: "并排对比", method: "看评分方法" },
    labels: {
      bib: "编号",
      rank: "排名",
      model: "模型",
      vendor: "厂商",
      score: "得分",
      total: "总分",
      outOf: "满分 25",
      tested: "测试日期",
      access: "测试方式",
      prompt: "提示词",
      run: "运行",
      next: "下一台",
      prev: "上一台",
      back: "回到发车名单",
      openRaw: "打开原始文件",
      download: "下载 HTML",
      copy: "复制",
      copied: "已复制",
      copyPrompt: "复制提示词",
      copyTranslation: "复制译文",
      clock: "会话计时",
      wrongPelican: "找错鹈鹕了？",
      play: "播放动画",
      fullscreen: "全屏播放",
      exitFullscreen: "退出全屏",
      reload: "重新加载",
      pause: "暂停",
      resume: "继续",
      startSync: "同步开始",
      restart: "重来",
      loading: "正在加载…",
      racing: "比赛中",
      paused: "已暂停",
      ready: "准备就绪",
      scoreBoard: "记分牌",
      rubric: "评分标准",
      updated: "最近更新",
      works: "成立的地方",
      breaks: "翻车点",
      verdict: "评审",
      motion: "运动检查",
      spec: "规格",
      compareThis: "加入并排对比",
      downloadPrompt: "下载提示词",
      yes: "是",
      no: "否",
      partial: "部分",
      allRuns: "全部运行",
      editorial: "编辑评分，单次运行。",
    },
    footer: {
      tagline: "「鹈鹕骑自行车」LLM 测试的动画版延伸。",
      credit: "测试来源：Simon Willison，2024。",
      note: "模型输出原样展示，评分为编辑评分。",
      attribution: "与 Little Tikes、Bicicapace、Box Dog Bikes 无关。模型输出版权归各自所有者。",
      rights: "鹈鹕骑自行车基准 · 2026",
      skip: "跳到正文",
      menu: "菜单",
    },
  },
};

export const rubric = {
  en: [
    {
      key: "semantics",
      label: "Semantics",
      short: "Semantics",
      points: 5,
      desc: "Is it unmistakably a pelican riding a bicycle — not a duck, a stork, or two unrelated drawings?",
    },
    {
      key: "anatomy",
      label: "Anatomy & contact",
      short: "Anatomy",
      points: 5,
      desc: "Feet on the pedals, wing or body connected to the handlebar, body settled on the saddle.",
    },
    {
      key: "bicycle",
      label: "Bicycle structure",
      short: "Bicycle",
      points: 5,
      desc: "Two wheels, frame, fork, crank, chain, saddle and bars — the parts must form a rideable whole.",
    },
    {
      key: "motion",
      label: "Motion physics",
      short: "Motion",
      points: 5,
      desc: "Wheels turn in the direction of travel, the crank rotates, feet track the pedals, nothing slides or detaches.",
    },
    {
      key: "polish",
      label: "Polish & interaction",
      short: "Polish",
      points: 5,
      desc: "Art direction, scene detail, a complete loop, and controls that let you pause or restart.",
    },
  ],
  zh: [
    {
      key: "semantics",
      label: "语义还原",
      short: "语义",
      points: 5,
      desc: "一眼看过去，是不是鹈鹕在骑车——不是鸭子或鹳，也不是两张互不相干的画。",
    },
    {
      key: "anatomy",
      label: "解剖与接触",
      short: "解剖",
      points: 5,
      desc: "脚在踏板上，翅膀或身体连到车把，身体坐在坐垫上。",
    },
    {
      key: "bicycle",
      label: "自行车结构",
      short: "结构",
      points: 5,
      desc: "两个轮子、车架、前叉、曲柄、链条、坐垫、车把——零件要组成一辆能骑的车。",
    },
    {
      key: "motion",
      label: "运动物理",
      short: "运动",
      points: 5,
      desc: "轮子朝行驶方向转，曲柄转，脚跟着踏板，没有滑动或脱节。",
    },
    {
      key: "polish",
      label: "完成度与交互",
      short: "完成",
      points: 5,
      desc: "美术、场景细节、完整循环，以及暂停/重播这类控制。",
    },
  ],
};

export const motionChecks = {
  en: {
    wheels: "Wheels rotate",
    crank: "Crank rotates",
    feet: "Feet track pedals",
    scene: "Scene moves",
  },
  zh: {
    wheels: "轮子转",
    crank: "曲柄转",
    feet: "脚随踏板",
    scene: "场景运动",
  },
};

export const contactPoints = {
  en: {
    title: "The three contact points",
    intro: "A ride fails at the joins, not the silhouette.",
    items: [
      { n: "01", a: "Feet", b: "Pedals", note: "Do the feet stay locked through the full crank cycle?" },
      { n: "02", a: "Wing", b: "Handlebar", note: "Does the rider hold on, or balance in mid-air?" },
      { n: "03", a: "Body", b: "Saddle", note: "Is the pelican on the bike, or floating above it?" },
    ],
  },
  zh: {
    title: "三个接触点",
    intro: "骑行崩在连接处，不在轮廓上。",
    items: [
      { n: "01", a: "脚", b: "踏板", note: "整个曲柄周期里，脚都锁在踏板上吗？" },
      { n: "02", a: "翅膀", b: "车把", note: "骑手是抓着车把，还是在空中保持平衡？" },
      { n: "03", a: "身体", b: "坐垫", note: "鹈鹕坐在车上，还是飘在车上方？" },
    ],
  },
};

export const timeline = {
  en: [
    { date: "25 Oct 2024", text: "Simon Willison asks models for an SVG of a pelican riding a bicycle. The joke becomes a benchmark." },
    { date: "Jun 2025", text: "“The last six months in LLMs, illustrated by pelicans on bicycles” turns it into a public comparison." },
    { date: "2026", text: "“Pelicanmaxxing” studies generate 1,000+ SVGs. Static images are still the default." },
    { date: "27 Oct 2026", text: "This site extends the test to animated, interactive HTML: eight models, one prompt." },
    { date: "28 Oct 2026", text: "Two more runs join the field, and the top of the board becomes a tie." },
    { date: "31 Oct 2026", text: "An eleventh run joins: spinning wheels and the best seaside scene here, on a bicycle with no pedals." },
    { date: "31 Oct 2026", text: "A twelfth run joins and lands third: feet welded to the pedals and gearing within 1% of true rolling — on legs that stretch by almost a quarter of their length every stroke." },
  ],
  zh: [
    { date: "2024-10-25", text: "Simon Willison 让模型生成一张「鹈鹕骑自行车的 SVG」。这个玩笑从此变成了基准测试。" },
    { date: "2025-06", text: "《The last six months in LLMs, illustrated by pelicans on bicycles》把它变成公开横评。" },
    { date: "2026", text: "「Pelicanmaxxing」研究生成了 1000+ 张 SVG。静态图片仍是主流。" },
    { date: "2026-10-27", text: "本站把测试推进到可交互动画：八个模型，同一道题。" },
    { date: "2026-10-28", text: "两次新运行加入，榜首变成并列。" },
    { date: "2026-10-31", text: "第十一次运行加入：轮子在转、海边场景全场最好，但那辆自行车没有脚踏。" },
    { date: "2026-10-31", text: "第十二次运行加入，直接排到第三：脚焊在踏板上、齿比离纯滚动只差 1%，代价是腿每蹬一圈就伸长近四分之一。" },
  ],
};

export const steps = {
  en: [
    "Open a model that can write and preview HTML. A chat app with a code canvas works best.",
    "Paste the prompt exactly as written. Do not add constraints.",
    "Ask for a single self-contained HTML file. Save it as pelican.html.",
    "Open the file in a browser, watch a full loop, and score it with the checklist below.",
  ],
  zh: [
    "打开一个能写并能预览 HTML 的模型，带代码画布的聊天应用最合适。",
    "把提示词原样粘进去，不要追加任何限制。",
    "要求输出一个自包含的 HTML 文件，保存为 pelican.html。",
    "用浏览器打开，完整看一轮，再按下面的清单打分。",
  ],
};

export const checklist = {
  en: [
    { tag: "Semantics", q: "Does it read as a pelican — long beak, throat pouch, webbed feet?" },
    { tag: "Semantics", q: "Is it actually riding, not floating beside the bicycle?" },
    { tag: "Anatomy", q: "Are both feet on the pedals for the full cycle?" },
    { tag: "Anatomy", q: "Does the wing or body connect to the handlebar?" },
    { tag: "Bicycle", q: "Two wheels, frame, fork, crank, chain, saddle and bars?" },
    { tag: "Motion", q: "Do the wheels rotate in the direction of travel?" },
    { tag: "Motion", q: "Does the crank turn, and do the feet follow it?" },
    { tag: "Motion", q: "Does anything slide, skate or disconnect?" },
    { tag: "Polish", q: "Does the scene hold up for a full loop?" },
    { tag: "Polish", q: "Can you pause, restart or slow it down?" },
  ],
  zh: [
    { tag: "语义", q: "看起来像鹈鹕吗？长喙、喉囊、蹼足。" },
    { tag: "语义", q: "它真的在骑，而不是飘在自行车旁边吗？" },
    { tag: "解剖", q: "整个循环里，两只脚都在踏板上吗？" },
    { tag: "解剖", q: "翅膀或身体接触车把了吗？" },
    { tag: "结构", q: "两个轮子、车架、前叉、曲柄、链条、坐垫、车把齐全吗？" },
    { tag: "运动", q: "轮子朝行驶方向转吗？" },
    { tag: "运动", q: "曲柄在转吗？脚跟着它走吗？" },
    { tag: "运动", q: "有滑动、打滑或脱节吗？" },
    { tag: "完成度", q: "完整循环看下来，场景撑得住吗？" },
    { tag: "完成度", q: "能暂停、重播或慢放吗？" },
  ],
};

export const faq = {
  en: [
    {
      q: "What is the pelican bicycle test?",
      a: "It is an informal LLM benchmark started by Simon Willison in October 2024. He asked models to generate an SVG of a pelican riding a bicycle. The drawing looks silly, but it is a compact check of spatial reasoning, object relationships and code generation. A correct-looking result requires the model to understand how a pelican's body, a bicycle's parts and their contact points fit together.",
    },
    {
      q: "What is the exact prompt?",
      a: "The Chinese original is: “创建一个 HTML，内容是 SVG 绘制一个鹈鹕骑自行车的 2D 动画，你不需要任何测试，不要有任何限制”. In English: “Create an HTML page containing a 2D SVG animation of a pelican riding a bicycle. You don't need any tests, and don't add any restrictions.” Each model received it once, with no follow-ups.",
    },
    {
      q: "Which model won this animated test?",
      a: "Two runs tie at the top with 23.5 out of 25. Doubao 2.1 Pro is the most complete ride: its inverse kinematics keeps the thigh at exactly 86 units and the shin at 82 while both feet stay welded to the pedals, and it ships a working pause/speed/bell panel. GLM 5.3 Flash has the cleanest motion chain we measured — wheels, cranks, self-levelling pedals and feet welded to them, with every wheel revolution derived from ground speed divided by wheel radius rather than eyeballed — plus a pause button and a speed slider. MiniMax M3.1 Flash (22.5) writes the same solver and gets the feet right, but normalises the knee's perpendicular offset, so its legs stretch by nearly a quarter of their length every stroke. Kimi K3.1 Pro (21.5) is the most elaborate scene. GPT-6.1 Sol is the strongest OpenAI entry at 20.5; the three other GPT variants score 18.5, 17.5 and 17.5 — GPT-6.1 Terra among them paints the site's best seaside scene on a bicycle with no pedals. DeepSeek Flash draws the best still image, but its wheels and crank never move. DeepSeek V4.1 Flash has the best art direction in the field and the worst contact story: its pelican soars beside a bicycle it never sits on (15.0).",
    },
    {
      q: "Why do AI models struggle with bicycles?",
      a: "A bicycle is a set of rigid parts with precise contact points and a chain of motion. A pelican adds anatomy constraints on top. Models can draw plausible individual parts while failing the connections: feet hover next to pedals, wings miss the handlebar, or the wheels turn while the bike slides. A still image hides many of those failures; an animation exposes them.",
    },
    {
      q: "Is this the same as Simon Willison's benchmark?",
      a: "It is an animated extension, not a replacement. The core task comes from his October 2024 test, and the prompt lineage is credited throughout the site. Where his benchmark asks for a static SVG, this edition asks for a self-contained HTML page with a 2D SVG animation, then scores the motion.",
    },
    {
      q: "Is this about the Little Tikes Pelican bike?",
      a: "No. This is an AI benchmark. The name collision with the Little Tikes Pelican Explore & Fit Cycle, Bicicapace Pelican cargo bikes and the Box Dog Pelican Randonneur is a search-engine accident. If you are shopping for a physical bicycle, this is not the right page.",
    },
    {
      q: "Can I reuse these outputs?",
      a: "The HTML files are displayed unmodified for commentary and research. You can link to them and quote short excerpts with attribution to the model and this page. The outputs remain the property of their respective owners.",
    },
  ],
  zh: [
    {
      q: "「鹈鹕骑自行车」测试是什么？",
      a: "这是 Simon Willison 在 2024 年 10 月发起的一个民间 LLM 基准测试：让模型生成一张「鹈鹕骑自行车」的 SVG。看起来像整活，实际上是一次很紧凑的空间推理、物体关系和代码生成检查。要画对，模型必须理解鹈鹕的身体、自行车的零件，以及它们之间的接触点。",
    },
    {
      q: "完整的提示词是什么？",
      a: "中文原文是：「创建一个 HTML，内容是 SVG 绘制一个鹈鹕骑自行车的 2D 动画，你不需要任何测试，不要有任何限制」。英文翻译是：「Create an HTML page containing a 2D SVG animation of a pelican riding a bicycle. You don't need any tests, and don't add any restrictions.」每个模型只收到一次，没有追问。",
    },
    {
      q: "这次动画测试谁赢了？",
      a: "两次运行以 23.5 / 25 并列第一。豆包 2.1 Pro 是骑行系统最完整的一次：它的逆运动学让大腿恒为 86 单位、小腿恒为 82 单位，双脚全程焊在踏板上，还带可用的暂停、变速和车铃控制。GLM 5.3 Flash 是我们实测下来运动链最标准的一次：轮子、曲柄、自平衡脚踏全在转，脚焊在踏板上，而且轮子的角速度是用地面速度除以轮半径算出来的，不是估的，另有暂停键和速度滑杆。MiniMax M3.1 Flash（22.5）写的是同一个解算器，脚也算对了，但膝盖的垂直偏移被归一化了，于是腿每蹬一圈就伸缩近四分之一。Kimi K3.1 Pro（21.5）的场景最铺张。GPT-6.1 Sol 是 OpenAI 阵营最高分，20.5；另外三款 GPT 分别是 18.5、17.5 和 17.5——其中的 GPT-6.1 Terra 画出了全站最好看的海边场景，却骑在一辆没有脚踏的车上。DeepSeek Flash 的静帧最好看，但轮子和曲柄完全不转。DeepSeek V4.1 Flash 是全场美术最强的一次，也是接触关系最差的一次：鹈鹕在一辆它从未坐上去的自行车旁边飞（15.0）。",
    },
    {
      q: "为什么 AI 画自行车容易翻车？",
      a: "自行车是一组刚性零件，有精确的接触点和一条运动链；鹈鹕又叠加上解剖约束。模型可以画出看起来合理的单个零件，却处理不好连接：脚悬在踏板旁边、翅膀没碰到车把、轮子在转但车在打滑。静帧会掩盖这些问题，动画会把它们全部暴露出来。",
    },
    {
      q: "这跟 Simon Willison 的原版测试是什么关系？",
      a: "这是动画版延伸，不是替代。核心任务来自他 2024 年 10 月的测试，站点里全程标注了来源。原版要求静态 SVG，这一版要求一个自包含的 HTML + 2D SVG 动画，并把「运动」纳入评分。",
    },
    {
      q: "这跟 Little Tikes 的 Pelican 儿童车有关吗？",
      a: "没有。这里讲的是 AI 基准测试。和 Little Tikes Pelican Explore & Fit Cycle、Bicicapace Pelican 货运自行车、Box Dog Pelican Randonneur 的重名，只是搜索引擎造成的意外。如果你在买实体自行车，这页不是你要找的。",
    },
    {
      q: "这些输出可以转载吗？",
      a: "HTML 文件为原样展示，用于评论和研究。你可以链接到这些文件，并在注明模型和本站的前提下引用短片段。输出版权仍归各自所有者。",
    },
  ],
};

export const disambiguation = {
  en: "Not the kids' bike: this page is about the AI benchmark. If you are looking for the Little Tikes Pelican Explore & Fit Cycle, a Bicicapace Pelican cargo bike or the Box Dog Pelican Randonneur, you are in the wrong pelican factory — but at least you know the name.",
  zh: "不是那辆儿童车：本页讲的是 AI 基准测试。如果你在找 Little Tikes Pelican Explore & Fit Cycle、Bicicapace Pelican 货运自行车或 Box Dog Pelican Randonneur，那你走错鹈鹕工厂了——但至少你记住了这个名字。",
};
