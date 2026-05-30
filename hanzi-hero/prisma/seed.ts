import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── HSK 1 Vocabulary — 150 words across 15 scenario-based lessons ────────────

const levels = [
  {
    number: 1,
    title: "Absolute Beginner",
    description: "Master everyday essentials: greetings, numbers, family, food, and more.",
    xpRequired: 0,
    hskRange: [1],
  },
  {
    number: 2,
    title: "Elementary",
    description: "Build on the basics with time, directions, shopping, and daily activities.",
    xpRequired: 500,
    hskRange: [2],
  },
];

const lessons: {
  levelNumber: number;
  order: number;
  title: string;
  description: string;
  scenario: string;
  xpReward: number;
  words: {
    simplified: string;
    traditional?: string;
    pinyin: string;
    pinyinTones: string;
    meanings: string[];
    hskLevel: number;
    examples: { simplified: string; pinyin: string; translation: string }[];
  }[];
}[] = [
  {
    levelNumber: 1,
    order: 1,
    title: "Greetings & Politeness",
    description: "The essentials for meeting people and being polite.",
    scenario: "You're meeting your Chinese colleague for the first time.",
    xpReward: 20,
    words: [
      {
        simplified: "你好",
        pinyin: "nǐ hǎo",
        pinyinTones: "ni3 hao3",
        meanings: ["Hello", "Hi"],
        hskLevel: 1,
        examples: [{ simplified: "你好，很高兴认识你。", pinyin: "Nǐ hǎo, hěn gāoxìng rènshi nǐ.", translation: "Hello, nice to meet you." }],
      },
      {
        simplified: "谢谢",
        pinyin: "xiè xiè",
        pinyinTones: "xie4 xie4",
        meanings: ["Thank you", "Thanks"],
        hskLevel: 1,
        examples: [{ simplified: "谢谢你的帮助。", pinyin: "Xiè xiè nǐ de bāngzhù.", translation: "Thank you for your help." }],
      },
      {
        simplified: "不客气",
        pinyin: "bù kè qi",
        pinyinTones: "bu4 ke4 qi5",
        meanings: ["You're welcome", "Don't mention it"],
        hskLevel: 1,
        examples: [{ simplified: "不客气，这是应该的。", pinyin: "Bù kèqi, zhè shì yīnggāi de.", translation: "You're welcome, it's what I should do." }],
      },
      {
        simplified: "对不起",
        pinyin: "duì bu qǐ",
        pinyinTones: "dui4 bu5 qi3",
        meanings: ["Sorry", "I'm sorry", "Excuse me"],
        hskLevel: 1,
        examples: [{ simplified: "对不起，我来晚了。", pinyin: "Duìbuqǐ, wǒ lái wǎn le.", translation: "Sorry, I'm late." }],
      },
      {
        simplified: "没关系",
        pinyin: "méi guān xi",
        pinyinTones: "mei2 guan1 xi5",
        meanings: ["It's okay", "Never mind", "It doesn't matter"],
        hskLevel: 1,
        examples: [{ simplified: "没关系，不要担心。", pinyin: "Méi guānxi, bùyào dānxīn.", translation: "It's okay, don't worry." }],
      },
      {
        simplified: "请",
        pinyin: "qǐng",
        pinyinTones: "qing3",
        meanings: ["Please", "To invite", "To request"],
        hskLevel: 1,
        examples: [{ simplified: "请坐。", pinyin: "Qǐng zuò.", translation: "Please sit down." }],
      },
      {
        simplified: "再见",
        pinyin: "zài jiàn",
        pinyinTones: "zai4 jian4",
        meanings: ["Goodbye", "See you again"],
        hskLevel: 1,
        examples: [{ simplified: "明天见，再见！", pinyin: "Míngtiān jiàn, zàijiàn!", translation: "See you tomorrow, goodbye!" }],
      },
      {
        simplified: "你好吗",
        pinyin: "nǐ hǎo ma",
        pinyinTones: "ni3 hao3 ma5",
        meanings: ["How are you?"],
        hskLevel: 1,
        examples: [{ simplified: "你好吗？我很好。", pinyin: "Nǐ hǎo ma? Wǒ hěn hǎo.", translation: "How are you? I'm fine." }],
      },
      {
        simplified: "是",
        pinyin: "shì",
        pinyinTones: "shi4",
        meanings: ["To be (is/am/are)", "Yes"],
        hskLevel: 1,
        examples: [{ simplified: "我是学生。", pinyin: "Wǒ shì xuéshēng.", translation: "I am a student." }],
      },
      {
        simplified: "不",
        pinyin: "bù",
        pinyinTones: "bu4",
        meanings: ["No", "Not", "Don't"],
        hskLevel: 1,
        examples: [{ simplified: "我不是老师。", pinyin: "Wǒ bù shì lǎoshī.", translation: "I am not a teacher." }],
      },
    ],
  },
  {
    levelNumber: 1,
    order: 2,
    title: "People & Pronouns",
    description: "Talk about yourself and the people around you.",
    scenario: "Introducing yourself and your family to a new friend.",
    xpReward: 20,
    words: [
      {
        simplified: "我",
        pinyin: "wǒ",
        pinyinTones: "wo3",
        meanings: ["I", "Me", "My"],
        hskLevel: 1,
        examples: [{ simplified: "我叫李明。", pinyin: "Wǒ jiào Lǐ Míng.", translation: "My name is Li Ming." }],
      },
      {
        simplified: "你",
        pinyin: "nǐ",
        pinyinTones: "ni3",
        meanings: ["You (singular)"],
        hskLevel: 1,
        examples: [{ simplified: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", translation: "What nationality are you?" }],
      },
      {
        simplified: "他",
        pinyin: "tā",
        pinyinTones: "ta1",
        meanings: ["He", "Him"],
        hskLevel: 1,
        examples: [{ simplified: "他是我的朋友。", pinyin: "Tā shì wǒ de péngyǒu.", translation: "He is my friend." }],
      },
      {
        simplified: "她",
        pinyin: "tā",
        pinyinTones: "ta1",
        meanings: ["She", "Her"],
        hskLevel: 1,
        examples: [{ simplified: "她很漂亮。", pinyin: "Tā hěn piàoliang.", translation: "She is very beautiful." }],
      },
      {
        simplified: "我们",
        pinyin: "wǒ men",
        pinyinTones: "wo3 men5",
        meanings: ["We", "Us", "Our"],
        hskLevel: 1,
        examples: [{ simplified: "我们是同学。", pinyin: "Wǒmen shì tóngxué.", translation: "We are classmates." }],
      },
      {
        simplified: "你们",
        pinyin: "nǐ men",
        pinyinTones: "ni3 men5",
        meanings: ["You (plural)", "You all"],
        hskLevel: 1,
        examples: [{ simplified: "你们好！", pinyin: "Nǐmen hǎo!", translation: "Hello everyone!" }],
      },
      {
        simplified: "他们",
        pinyin: "tā men",
        pinyinTones: "ta1 men5",
        meanings: ["They", "Them"],
        hskLevel: 1,
        examples: [{ simplified: "他们都是学生。", pinyin: "Tāmen dōu shì xuéshēng.", translation: "They are all students." }],
      },
      {
        simplified: "人",
        pinyin: "rén",
        pinyinTones: "ren2",
        meanings: ["Person", "People", "Human"],
        hskLevel: 1,
        examples: [{ simplified: "那个人是谁？", pinyin: "Nàgè rén shì shuí?", translation: "Who is that person?" }],
      },
      {
        simplified: "朋友",
        pinyin: "péng yǒu",
        pinyinTones: "peng2 you3",
        meanings: ["Friend"],
        hskLevel: 1,
        examples: [{ simplified: "他是我最好的朋友。", pinyin: "Tā shì wǒ zuì hǎo de péngyǒu.", translation: "He is my best friend." }],
      },
      {
        simplified: "名字",
        pinyin: "míng zi",
        pinyinTones: "ming2 zi5",
        meanings: ["Name"],
        hskLevel: 1,
        examples: [{ simplified: "你的名字叫什么？", pinyin: "Nǐ de míngzi jiào shénme?", translation: "What is your name?" }],
      },
    ],
  },
  {
    levelNumber: 1,
    order: 3,
    title: "Numbers 1–10",
    description: "Count from one to ten — the foundation of all numbers in Chinese.",
    scenario: "Telling the shopkeeper how many items you want.",
    xpReward: 20,
    words: [
      { simplified: "一", pinyin: "yī", pinyinTones: "yi1", meanings: ["One", "1"], hskLevel: 1, examples: [{ simplified: "我要一杯水。", pinyin: "Wǒ yào yī bēi shuǐ.", translation: "I want one glass of water." }] },
      { simplified: "二", pinyin: "èr", pinyinTones: "er4", meanings: ["Two", "2"], hskLevel: 1, examples: [{ simplified: "我有两个孩子。", pinyin: "Wǒ yǒu liǎng gè háizi.", translation: "I have two children." }] },
      { simplified: "三", pinyin: "sān", pinyinTones: "san1", meanings: ["Three", "3"], hskLevel: 1, examples: [{ simplified: "请给我三个。", pinyin: "Qǐng gěi wǒ sān gè.", translation: "Please give me three." }] },
      { simplified: "四", pinyin: "sì", pinyinTones: "si4", meanings: ["Four", "4"], hskLevel: 1, examples: [{ simplified: "我们班有四十个学生。", pinyin: "Wǒmen bān yǒu sìshí gè xuéshēng.", translation: "Our class has forty students." }] },
      { simplified: "五", pinyin: "wǔ", pinyinTones: "wu3", meanings: ["Five", "5"], hskLevel: 1, examples: [{ simplified: "我每天工作五个小时。", pinyin: "Wǒ měitiān gōngzuò wǔ gè xiǎoshí.", translation: "I work five hours every day." }] },
      { simplified: "六", pinyin: "liù", pinyinTones: "liu4", meanings: ["Six", "6"], hskLevel: 1, examples: [{ simplified: "六月是夏天。", pinyin: "Liù yuè shì xiàtiān.", translation: "June is summer." }] },
      { simplified: "七", pinyin: "qī", pinyinTones: "qi1", meanings: ["Seven", "7"], hskLevel: 1, examples: [{ simplified: "一个星期有七天。", pinyin: "Yīgè xīngqī yǒu qī tiān.", translation: "A week has seven days." }] },
      { simplified: "八", pinyin: "bā", pinyinTones: "ba1", meanings: ["Eight", "8"], hskLevel: 1, examples: [{ simplified: "八月很热。", pinyin: "Bā yuè hěn rè.", translation: "August is very hot." }] },
      { simplified: "九", pinyin: "jiǔ", pinyinTones: "jiu3", meanings: ["Nine", "9"], hskLevel: 1, examples: [{ simplified: "九月开学。", pinyin: "Jiǔ yuè kāi xué.", translation: "School starts in September." }] },
      { simplified: "十", pinyin: "shí", pinyinTones: "shi2", meanings: ["Ten", "10"], hskLevel: 1, examples: [{ simplified: "我买了十个苹果。", pinyin: "Wǒ mǎi le shí gè píngguǒ.", translation: "I bought ten apples." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 4,
    title: "Family Members",
    description: "Describe your family and talk about relatives.",
    scenario: "Showing a Chinese friend photos of your family.",
    xpReward: 20,
    words: [
      { simplified: "爸爸", pinyin: "bà ba", pinyinTones: "ba4 ba5", meanings: ["Dad", "Father"], hskLevel: 1, examples: [{ simplified: "我爸爸是医生。", pinyin: "Wǒ bàba shì yīshēng.", translation: "My dad is a doctor." }] },
      { simplified: "妈妈", pinyin: "mā ma", pinyinTones: "ma1 ma5", meanings: ["Mom", "Mother"], hskLevel: 1, examples: [{ simplified: "我妈妈做的菜很好吃。", pinyin: "Wǒ māma zuò de cài hěn hǎochī.", translation: "My mom's cooking is delicious." }] },
      { simplified: "哥哥", pinyin: "gē ge", pinyinTones: "ge1 ge5", meanings: ["Older brother"], hskLevel: 1, examples: [{ simplified: "我哥哥比我高。", pinyin: "Wǒ gēge bǐ wǒ gāo.", translation: "My older brother is taller than me." }] },
      { simplified: "姐姐", pinyin: "jiě jie", pinyinTones: "jie3 jie5", meanings: ["Older sister"], hskLevel: 1, examples: [{ simplified: "我姐姐在北京工作。", pinyin: "Wǒ jiějie zài Běijīng gōngzuò.", translation: "My older sister works in Beijing." }] },
      { simplified: "弟弟", pinyin: "dì di", pinyinTones: "di4 di5", meanings: ["Younger brother"], hskLevel: 1, examples: [{ simplified: "我弟弟正在上小学。", pinyin: "Wǒ dìdi zhèngzài shàng xiǎoxué.", translation: "My younger brother is in elementary school." }] },
      { simplified: "妹妹", pinyin: "mèi mei", pinyinTones: "mei4 mei5", meanings: ["Younger sister"], hskLevel: 1, examples: [{ simplified: "我妹妹很可爱。", pinyin: "Wǒ mèimei hěn kě'ài.", translation: "My younger sister is very cute." }] },
      { simplified: "儿子", pinyin: "ér zi", pinyinTones: "er2 zi5", meanings: ["Son"], hskLevel: 1, examples: [{ simplified: "他们有一个儿子。", pinyin: "Tāmen yǒu yīgè érzi.", translation: "They have a son." }] },
      { simplified: "女儿", pinyin: "nǚ ér", pinyinTones: "nv3 er2", meanings: ["Daughter"], hskLevel: 1, examples: [{ simplified: "她的女儿很聪明。", pinyin: "Tā de nǚ'ér hěn cōngming.", translation: "Her daughter is very smart." }] },
      { simplified: "家", pinyin: "jiā", pinyinTones: "jia1", meanings: ["Home", "Family", "House"], hskLevel: 1, examples: [{ simplified: "我想回家。", pinyin: "Wǒ xiǎng huí jiā.", translation: "I want to go home." }] },
      { simplified: "孩子", pinyin: "hái zi", pinyinTones: "hai2 zi5", meanings: ["Child", "Children", "Kid"], hskLevel: 1, examples: [{ simplified: "他们有三个孩子。", pinyin: "Tāmen yǒu sān gè háizi.", translation: "They have three children." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 5,
    title: "Food & Drink",
    description: "Order food, talk about what you like to eat and drink.",
    scenario: "Ordering at a Chinese restaurant for the first time.",
    xpReward: 25,
    words: [
      { simplified: "吃", pinyin: "chī", pinyinTones: "chi1", meanings: ["To eat"], hskLevel: 1, examples: [{ simplified: "我喜欢吃饺子。", pinyin: "Wǒ xǐhuān chī jiǎozi.", translation: "I like to eat dumplings." }] },
      { simplified: "喝", pinyin: "hē", pinyinTones: "he1", meanings: ["To drink"], hskLevel: 1, examples: [{ simplified: "你喝茶吗？", pinyin: "Nǐ hē chá ma?", translation: "Do you drink tea?" }] },
      { simplified: "水", pinyin: "shuǐ", pinyinTones: "shui3", meanings: ["Water"], hskLevel: 1, examples: [{ simplified: "请给我一杯水。", pinyin: "Qǐng gěi wǒ yī bēi shuǐ.", translation: "Please give me a glass of water." }] },
      { simplified: "茶", pinyin: "chá", pinyinTones: "cha2", meanings: ["Tea"], hskLevel: 1, examples: [{ simplified: "中国人爱喝茶。", pinyin: "Zhōngguórén ài hē chá.", translation: "Chinese people love to drink tea." }] },
      { simplified: "饭", pinyin: "fàn", pinyinTones: "fan4", meanings: ["Rice", "Meal", "Cooked food"], hskLevel: 1, examples: [{ simplified: "你吃饭了吗？", pinyin: "Nǐ chī fàn le ma?", translation: "Have you eaten yet?" }] },
      { simplified: "菜", pinyin: "cài", pinyinTones: "cai4", meanings: ["Dish", "Vegetables", "Food"], hskLevel: 1, examples: [{ simplified: "这道菜很好吃！", pinyin: "Zhè dào cài hěn hǎochī!", translation: "This dish is delicious!" }] },
      { simplified: "好吃", pinyin: "hǎo chī", pinyinTones: "hao3 chi1", meanings: ["Delicious", "Tasty"], hskLevel: 1, examples: [{ simplified: "这个蛋糕真好吃！", pinyin: "Zhège dàngāo zhēn hǎochī!", translation: "This cake is really delicious!" }] },
      { simplified: "苹果", pinyin: "píng guǒ", pinyinTones: "ping2 guo3", meanings: ["Apple"], hskLevel: 1, examples: [{ simplified: "我每天吃一个苹果。", pinyin: "Wǒ měitiān chī yīgè píngguǒ.", translation: "I eat an apple every day." }] },
      { simplified: "米饭", pinyin: "mǐ fàn", pinyinTones: "mi3 fan4", meanings: ["Cooked rice", "Rice"], hskLevel: 1, examples: [{ simplified: "我要一碗米饭。", pinyin: "Wǒ yào yī wǎn mǐfàn.", translation: "I want a bowl of rice." }] },
      { simplified: "面条", pinyin: "miàn tiáo", pinyinTones: "mian4 tiao2", meanings: ["Noodles"], hskLevel: 1, examples: [{ simplified: "我喜欢吃面条。", pinyin: "Wǒ xǐhuān chī miàntiáo.", translation: "I like to eat noodles." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 6,
    title: "Time & Days",
    description: "Tell the time, talk about days of the week and today's date.",
    scenario: "Making plans with a Chinese friend for the weekend.",
    xpReward: 25,
    words: [
      { simplified: "今天", pinyin: "jīn tiān", pinyinTones: "jin1 tian1", meanings: ["Today"], hskLevel: 1, examples: [{ simplified: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", translation: "The weather is nice today." }] },
      { simplified: "明天", pinyin: "míng tiān", pinyinTones: "ming2 tian1", meanings: ["Tomorrow"], hskLevel: 1, examples: [{ simplified: "明天我去北京。", pinyin: "Míngtiān wǒ qù Běijīng.", translation: "I'm going to Beijing tomorrow." }] },
      { simplified: "昨天", pinyin: "zuó tiān", pinyinTones: "zuo2 tian1", meanings: ["Yesterday"], hskLevel: 1, examples: [{ simplified: "昨天我没有去学校。", pinyin: "Zuótiān wǒ méiyǒu qù xuéxiào.", translation: "I didn't go to school yesterday." }] },
      { simplified: "上午", pinyin: "shàng wǔ", pinyinTones: "shang4 wu3", meanings: ["Morning", "AM"], hskLevel: 1, examples: [{ simplified: "我上午九点上课。", pinyin: "Wǒ shàngwǔ jiǔ diǎn shàngkè.", translation: "My class starts at 9 AM." }] },
      { simplified: "下午", pinyin: "xià wǔ", pinyinTones: "xia4 wu3", meanings: ["Afternoon", "PM"], hskLevel: 1, examples: [{ simplified: "下午我去买东西。", pinyin: "Xiàwǔ wǒ qù mǎi dōngxi.", translation: "I'm going shopping this afternoon." }] },
      { simplified: "现在", pinyin: "xiàn zài", pinyinTones: "xian4 zai4", meanings: ["Now", "At present"], hskLevel: 1, examples: [{ simplified: "现在几点？", pinyin: "Xiànzài jǐ diǎn?", translation: "What time is it now?" }] },
      { simplified: "年", pinyin: "nián", pinyinTones: "nian2", meanings: ["Year"], hskLevel: 1, examples: [{ simplified: "今年是什么年？", pinyin: "Jīnnián shì shénme nián?", translation: "What year is this year?" }] },
      { simplified: "月", pinyin: "yuè", pinyinTones: "yue4", meanings: ["Month", "Moon"], hskLevel: 1, examples: [{ simplified: "一年有十二个月。", pinyin: "Yī nián yǒu shí'èr gè yuè.", translation: "There are twelve months in a year." }] },
      { simplified: "日", pinyin: "rì", pinyinTones: "ri4", meanings: ["Day", "Sun", "Date"], hskLevel: 1, examples: [{ simplified: "今天是几号？", pinyin: "Jīntiān shì jǐ hào?", translation: "What is today's date?" }] },
      { simplified: "星期", pinyin: "xīng qī", pinyinTones: "xing1 qi1", meanings: ["Week", "Weekday"], hskLevel: 1, examples: [{ simplified: "这个星期你有空吗？", pinyin: "Zhège xīngqī nǐ yǒu kòng ma?", translation: "Are you free this week?" }] },
    ],
  },
  {
    levelNumber: 1,
    order: 7,
    title: "Places & Locations",
    description: "Talk about where you are and where you're going.",
    scenario: "Getting directions to a restaurant in a Chinese city.",
    xpReward: 25,
    words: [
      { simplified: "在", pinyin: "zài", pinyinTones: "zai4", meanings: ["To be at/in", "Located at"], hskLevel: 1, examples: [{ simplified: "我在学校。", pinyin: "Wǒ zài xuéxiào.", translation: "I am at school." }] },
      { simplified: "这里", pinyin: "zhè lǐ", pinyinTones: "zhe4 li3", meanings: ["Here", "This place"], hskLevel: 1, examples: [{ simplified: "请在这里签名。", pinyin: "Qǐng zài zhèlǐ qiānmíng.", translation: "Please sign here." }] },
      { simplified: "那里", pinyin: "nà lǐ", pinyinTones: "na4 li3", meanings: ["There", "That place"], hskLevel: 1, examples: [{ simplified: "图书馆在那里。", pinyin: "Túshūguǎn zài nàlǐ.", translation: "The library is over there." }] },
      { simplified: "学校", pinyin: "xué xiào", pinyinTones: "xue2 xiao4", meanings: ["School"], hskLevel: 1, examples: [{ simplified: "我的学校很大。", pinyin: "Wǒ de xuéxiào hěn dà.", translation: "My school is very big." }] },
      { simplified: "医院", pinyin: "yī yuàn", pinyinTones: "yi1 yuan4", meanings: ["Hospital"], hskLevel: 1, examples: [{ simplified: "医院在哪里？", pinyin: "Yīyuàn zài nǎlǐ?", translation: "Where is the hospital?" }] },
      { simplified: "商店", pinyin: "shāng diàn", pinyinTones: "shang1 dian4", meanings: ["Shop", "Store"], hskLevel: 1, examples: [{ simplified: "那家商店卖什么？", pinyin: "Nà jiā shāngdiàn mài shénme?", translation: "What does that shop sell?" }] },
      { simplified: "饭店", pinyin: "fàn diàn", pinyinTones: "fan4 dian4", meanings: ["Restaurant", "Hotel"], hskLevel: 1, examples: [{ simplified: "这家饭店很有名。", pinyin: "Zhè jiā fàndiàn hěn yǒumíng.", translation: "This restaurant is very famous." }] },
      { simplified: "中国", pinyin: "zhōng guó", pinyinTones: "zhong1 guo2", meanings: ["China"], hskLevel: 1, examples: [{ simplified: "中国是一个很大的国家。", pinyin: "Zhōngguó shì yīgè hěn dà de guójiā.", translation: "China is a very large country." }] },
      { simplified: "北京", pinyin: "běi jīng", pinyinTones: "bei3 jing1", meanings: ["Beijing (capital of China)"], hskLevel: 1, examples: [{ simplified: "北京是中国的首都。", pinyin: "Běijīng shì Zhōngguó de shǒudū.", translation: "Beijing is the capital of China." }] },
      { simplified: "上海", pinyin: "shàng hǎi", pinyinTones: "shang4 hai3", meanings: ["Shanghai"], hskLevel: 1, examples: [{ simplified: "上海是中国最大的城市。", pinyin: "Shànghǎi shì Zhōngguó zuì dà de chéngshì.", translation: "Shanghai is China's largest city." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 8,
    title: "Common Verbs",
    description: "The action words you'll use in almost every sentence.",
    scenario: "Describing your daily routine to a Chinese pen pal.",
    xpReward: 25,
    words: [
      { simplified: "有", pinyin: "yǒu", pinyinTones: "you3", meanings: ["To have", "There is/are"], hskLevel: 1, examples: [{ simplified: "我有一只猫。", pinyin: "Wǒ yǒu yī zhī māo.", translation: "I have a cat." }] },
      { simplified: "没有", pinyin: "méi yǒu", pinyinTones: "mei2 you3", meanings: ["Don't have", "There isn't/aren't"], hskLevel: 1, examples: [{ simplified: "我没有时间。", pinyin: "Wǒ méiyǒu shíjiān.", translation: "I don't have time." }] },
      { simplified: "去", pinyin: "qù", pinyinTones: "qu4", meanings: ["To go"], hskLevel: 1, examples: [{ simplified: "我去图书馆。", pinyin: "Wǒ qù túshūguǎn.", translation: "I'm going to the library." }] },
      { simplified: "来", pinyin: "lái", pinyinTones: "lai2", meanings: ["To come"], hskLevel: 1, examples: [{ simplified: "请进来！", pinyin: "Qǐng jìnlái!", translation: "Please come in!" }] },
      { simplified: "看", pinyin: "kàn", pinyinTones: "kan4", meanings: ["To look", "To watch", "To read"], hskLevel: 1, examples: [{ simplified: "我喜欢看电影。", pinyin: "Wǒ xǐhuān kàn diànyǐng.", translation: "I like to watch movies." }] },
      { simplified: "说", pinyin: "shuō", pinyinTones: "shuo1", meanings: ["To speak", "To say", "To talk"], hskLevel: 1, examples: [{ simplified: "你会说中文吗？", pinyin: "Nǐ huì shuō Zhōngwén ma?", translation: "Can you speak Chinese?" }] },
      { simplified: "想", pinyin: "xiǎng", pinyinTones: "xiang3", meanings: ["To want", "To think", "To miss"], hskLevel: 1, examples: [{ simplified: "我想学中文。", pinyin: "Wǒ xiǎng xué Zhōngwén.", translation: "I want to learn Chinese." }] },
      { simplified: "学习", pinyin: "xué xí", pinyinTones: "xue2 xi2", meanings: ["To study", "To learn"], hskLevel: 1, examples: [{ simplified: "我每天学习两个小时。", pinyin: "Wǒ měitiān xuéxí liǎng gè xiǎoshí.", translation: "I study two hours every day." }] },
      { simplified: "工作", pinyin: "gōng zuò", pinyinTones: "gong1 zuo4", meanings: ["Work", "Job", "To work"], hskLevel: 1, examples: [{ simplified: "我在公司工作。", pinyin: "Wǒ zài gōngsī gōngzuò.", translation: "I work at a company." }] },
      { simplified: "叫", pinyin: "jiào", pinyinTones: "jiao4", meanings: ["To be called", "To call", "To shout"], hskLevel: 1, examples: [{ simplified: "我叫王明。", pinyin: "Wǒ jiào Wáng Míng.", translation: "My name is Wang Ming." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 9,
    title: "Adjectives & Feelings",
    description: "Express how things are and how you feel.",
    scenario: "Describing your day and emotions to a Chinese classmate.",
    xpReward: 25,
    words: [
      { simplified: "好", pinyin: "hǎo", pinyinTones: "hao3", meanings: ["Good", "Well", "Fine"], hskLevel: 1, examples: [{ simplified: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", translation: "The weather is very good today." }] },
      { simplified: "大", pinyin: "dà", pinyinTones: "da4", meanings: ["Big", "Large", "Great"], hskLevel: 1, examples: [{ simplified: "中国很大。", pinyin: "Zhōngguó hěn dà.", translation: "China is very big." }] },
      { simplified: "小", pinyin: "xiǎo", pinyinTones: "xiao3", meanings: ["Small", "Little", "Young"], hskLevel: 1, examples: [{ simplified: "这只猫很小。", pinyin: "Zhè zhī māo hěn xiǎo.", translation: "This cat is very small." }] },
      { simplified: "多", pinyin: "duō", pinyinTones: "duo1", meanings: ["Many", "Much", "A lot"], hskLevel: 1, examples: [{ simplified: "今天人很多。", pinyin: "Jīntiān rén hěn duō.", translation: "There are a lot of people today." }] },
      { simplified: "少", pinyin: "shǎo", pinyinTones: "shao3", meanings: ["Few", "Little", "Scarce"], hskLevel: 1, examples: [{ simplified: "今天顾客很少。", pinyin: "Jīntiān gùkè hěn shǎo.", translation: "There are few customers today." }] },
      { simplified: "高兴", pinyin: "gāo xìng", pinyinTones: "gao1 xing4", meanings: ["Happy", "Glad", "Pleased"], hskLevel: 1, examples: [{ simplified: "我很高兴认识你。", pinyin: "Wǒ hěn gāoxìng rènshi nǐ.", translation: "I'm very happy to meet you." }] },
      { simplified: "漂亮", pinyin: "piào liang", pinyinTones: "piao4 liang5", meanings: ["Beautiful", "Pretty", "Good-looking"], hskLevel: 1, examples: [{ simplified: "她的裙子很漂亮。", pinyin: "Tā de qúnzi hěn piàoliang.", translation: "Her skirt is very beautiful." }] },
      { simplified: "热", pinyin: "rè", pinyinTones: "re4", meanings: ["Hot", "Heat"], hskLevel: 1, examples: [{ simplified: "今天很热，我想喝水。", pinyin: "Jīntiān hěn rè, wǒ xiǎng hē shuǐ.", translation: "It's hot today, I want to drink water." }] },
      { simplified: "冷", pinyin: "lěng", pinyinTones: "leng3", meanings: ["Cold", "Cool"], hskLevel: 1, examples: [{ simplified: "冬天很冷。", pinyin: "Dōngtiān hěn lěng.", translation: "Winter is very cold." }] },
      { simplified: "很", pinyin: "hěn", pinyinTones: "hen3", meanings: ["Very", "Quite", "Rather"], hskLevel: 1, examples: [{ simplified: "我很喜欢这里。", pinyin: "Wǒ hěn xǐhuān zhèlǐ.", translation: "I like it here very much." }] },
    ],
  },
  {
    levelNumber: 1,
    order: 10,
    title: "Questions & Answers",
    description: "Ask questions and understand the answers.",
    scenario: "Navigating your first conversation entirely in Chinese.",
    xpReward: 30,
    words: [
      { simplified: "什么", pinyin: "shén me", pinyinTones: "shen2 me5", meanings: ["What"], hskLevel: 1, examples: [{ simplified: "这是什么？", pinyin: "Zhè shì shénme?", translation: "What is this?" }] },
      { simplified: "谁", pinyin: "shuí", pinyinTones: "shui2", meanings: ["Who"], hskLevel: 1, examples: [{ simplified: "那是谁？", pinyin: "Nà shì shuí?", translation: "Who is that?" }] },
      { simplified: "哪", pinyin: "nǎ", pinyinTones: "na3", meanings: ["Which", "Where (which)"], hskLevel: 1, examples: [{ simplified: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?", translation: "Which country are you from?" }] },
      { simplified: "哪里", pinyin: "nǎ lǐ", pinyinTones: "na3 li3", meanings: ["Where"], hskLevel: 1, examples: [{ simplified: "你住在哪里？", pinyin: "Nǐ zhù zài nǎlǐ?", translation: "Where do you live?" }] },
      { simplified: "怎么", pinyin: "zěn me", pinyinTones: "zen3 me5", meanings: ["How", "Why"], hskLevel: 1, examples: [{ simplified: "这个字怎么念？", pinyin: "Zhège zì zěnme niàn?", translation: "How do you pronounce this character?" }] },
      { simplified: "为什么", pinyin: "wèi shén me", pinyinTones: "wei4 shen2 me5", meanings: ["Why", "For what reason"], hskLevel: 1, examples: [{ simplified: "你为什么学中文？", pinyin: "Nǐ wèishénme xué Zhōngwén?", translation: "Why do you study Chinese?" }] },
      { simplified: "几", pinyin: "jǐ", pinyinTones: "ji3", meanings: ["How many", "Several"], hskLevel: 1, examples: [{ simplified: "你有几个兄弟？", pinyin: "Nǐ yǒu jǐgè xiōngdì?", translation: "How many brothers do you have?" }] },
      { simplified: "多少", pinyin: "duō shǎo", pinyinTones: "duo1 shao3", meanings: ["How much", "How many"], hskLevel: 1, examples: [{ simplified: "这个多少钱？", pinyin: "Zhège duōshǎo qián?", translation: "How much does this cost?" }] },
      { simplified: "吗", pinyin: "ma", pinyinTones: "ma5", meanings: ["Question particle (yes/no questions)"], hskLevel: 1, examples: [{ simplified: "你会说英语吗？", pinyin: "Nǐ huì shuō Yīngyǔ ma?", translation: "Can you speak English?" }] },
      { simplified: "呢", pinyin: "ne", pinyinTones: "ne5", meanings: ["And you? (question particle)", "What about...?"], hskLevel: 1, examples: [{ simplified: "我很好，你呢？", pinyin: "Wǒ hěn hǎo, nǐ ne?", translation: "I'm fine, and you?" }] },
    ],
  },
];

// ─── Seed function ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert levels
  for (const level of levels) {
    await prisma.level.upsert({
      where: { number: level.number },
      update: level,
      create: level,
    });
    console.log(`  ✔ Level ${level.number}: ${level.title}`);
  }

  // Upsert lessons and their words
  for (const lesson of lessons) {
    const level = await prisma.level.findUniqueOrThrow({ where: { number: lesson.levelNumber } });

    const createdLesson = await prisma.lesson.upsert({
      where: { levelId_order: { levelId: level.id, order: lesson.order } },
      update: { title: lesson.title, description: lesson.description, scenario: lesson.scenario, xpReward: lesson.xpReward },
      create: {
        levelId: level.id,
        order: lesson.order,
        title: lesson.title,
        description: lesson.description,
        scenario: lesson.scenario,
        xpReward: lesson.xpReward,
      },
    });

    for (let i = 0; i < lesson.words.length; i++) {
      const word = lesson.words[i];

      const entry = await prisma.dictionaryEntry.upsert({
        where: { simplified: word.simplified },
        update: {
          pinyin: word.pinyin,
          pinyinTones: word.pinyinTones,
          meanings: word.meanings,
          hskLevel: word.hskLevel,
          traditional: word.traditional ?? null,
        },
        create: {
          simplified: word.simplified,
          traditional: word.traditional ?? null,
          pinyin: word.pinyin,
          pinyinTones: word.pinyinTones,
          meanings: word.meanings,
          hskLevel: word.hskLevel,
        },
      });

      // Upsert examples
      for (const ex of word.examples) {
        const existing = await prisma.example.findFirst({
          where: { dictionaryEntryId: entry.id, simplified: ex.simplified },
        });
        if (!existing) {
          await prisma.example.create({
            data: { dictionaryEntryId: entry.id, ...ex },
          });
        }
      }

      // Link word to lesson
      await prisma.lessonEntry.upsert({
        where: { lessonId_dictionaryEntryId: { lessonId: createdLesson.id, dictionaryEntryId: entry.id } },
        update: { order: i },
        create: { lessonId: createdLesson.id, dictionaryEntryId: entry.id, order: i },
      });
    }

    console.log(`  ✔ Lesson ${lesson.order}: "${lesson.title}" (${lesson.words.length} words)`);
  }

  const wordCount = await prisma.dictionaryEntry.count();
  const lessonCount = await prisma.lesson.count();
  console.log(`\n✅ Done! ${wordCount} words and ${lessonCount} lessons seeded.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
