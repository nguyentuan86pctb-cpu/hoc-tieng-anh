import type { DialogueScenario, Grade, Lesson, LessonRoutineStep, PracticePhrase } from "@/types";

const gradeOne = [
  ["hello", "Hello", "Chào hỏi bạn mới"],
  ["colors", "Colors", "Nhận biết màu sắc"],
  ["numbers", "Numbers", "Đếm số từ 1 đến 10"],
  ["school-things", "School Things", "Đồ dùng học tập"],
  ["family", "Family", "Gia đình của bé"],
  ["animals", "Animals", "Con vật quen thuộc"],
  ["body-parts", "Body Parts", "Bộ phận cơ thể"],
  ["toys", "Toys", "Đồ chơi yêu thích"],
  ["food", "Food", "Món ăn hằng ngày"],
  ["fruits", "Fruits", "Trái cây quen thuộc"],
  ["drinks", "Drinks", "Đồ uống hằng ngày"],
  ["shapes", "Shapes", "Hình dạng cơ bản"],
  ["feelings", "Feelings", "Cảm xúc của bé"],
  ["playground", "Playground", "Sân chơi của bé"],
  ["bedroom", "Bedroom", "Phòng ngủ của bé"],
  ["bathroom", "Bathroom", "Phòng tắm"],
  ["transport", "Transport", "Phương tiện đi lại"],
  ["daily-routines", "Daily Routines", "Việc làm hằng ngày"],
  ["manners", "Manners", "Lời nói lịch sự"],
  ["review-1", "Review", "Ôn tập lớp 1"]
];

const gradeTwo = [
  ["greetings", "Greetings", "Chào hỏi tự nhiên hơn"],
  ["numbers-11-20", "Numbers 11-20", "Đếm số từ 11 đến 20"],
  ["actions", "Actions", "Hành động đơn giản"],
  ["my-classroom", "My Classroom", "Lớp học của em"],
  ["my-house", "My House", "Ngôi nhà của em"],
  ["clothes", "Clothes", "Quần áo"],
  ["weather", "Weather", "Thời tiết"],
  ["likes", "Likes", "Điều bé thích"],
  ["simple-questions", "Simple Questions", "Câu hỏi đơn giản"],
  ["places", "Places", "Địa điểm quen thuộc"],
  ["community-helpers", "Community Helpers", "Nghề nghiệp quen thuộc"],
  ["opposites", "Opposites", "Từ trái nghĩa đơn giản"],
  ["prepositions", "Prepositions", "Vị trí đồ vật"],
  ["time", "Time", "Thời gian trong ngày"],
  ["days", "Days", "Các ngày trong tuần"],
  ["health", "Health", "Sức khỏe đơn giản"],
  ["shopping", "Shopping", "Mua sắm đơn giản"],
  ["hobbies", "Hobbies", "Sở thích của bé"],
  ["story-time", "Story Time", "Kể chuyện ngắn"],
  ["review-2", "Review", "Ôn tập lớp 2"]
];

const topicVisuals: Record<string, string> = {
  hello: "👋",
  colors: "🌈",
  numbers: "🔢",
  "school-things": "🎒",
  family: "👨‍👩‍👧",
  animals: "🐶",
  "body-parts": "👀",
  toys: "🧸",
  food: "🍰",
  fruits: "🍎",
  drinks: "🥤",
  shapes: "🔶",
  feelings: "😊",
  playground: "🛝",
  bedroom: "🛏️",
  bathroom: "🧼",
  transport: "🚌",
  "daily-routines": "⏰",
  manners: "🙏",
  "review-1": "⭐",
  greetings: "🙋",
  "numbers-11-20": "1️⃣",
  actions: "🏃",
  "my-classroom": "🏫",
  "my-house": "🏠",
  clothes: "👕",
  weather: "☀️",
  likes: "💛",
  "simple-questions": "❓",
  places: "🏫",
  "community-helpers": "🧑‍⚕️",
  opposites: "↔️",
  prepositions: "📦",
  time: "🕘",
  days: "📅",
  health: "💪",
  shopping: "🛒",
  hobbies: "🎨",
  "story-time": "📖",
  "review-2": "🏆"
};

const videos: Record<string, [string, string]> = {
  hello: ["Hello! | Kids Greeting Song | Super Simple Songs", "https://www.youtube.com/embed/tVlcKp3bWH8"],
  colors: ["Color Song | Learn colors for kids | English Singsing", "https://www.youtube.com/embed/YRonvWl1g1s"],
  numbers: ["Counting 1-10 Song | The Singing Walrus", "https://www.youtube.com/embed/DR-cfDsHCGA"],
  family: ["Kids vocabulary - Family | English Singsing", "https://www.youtube.com/embed/FHaObkHEkHQ"],
  animals: ["Kids vocabulary - Animals", "https://www.youtube.com/embed/hewioIU4a64"],
  food: ["Kids vocabulary - Food", "https://www.youtube.com/embed/lW5TXrKbsq4"],
  greetings: ["What's Your Name? | Super Simple Songs", "https://www.youtube.com/embed/yqlbn_nI2w8"],
  "numbers-11-20": ["Numbers Song Let's Count 1-10", "https://www.youtube.com/embed/85M1yxIcHpw"],
  actions: ["Action Song for Kids", "https://www.youtube.com/embed/dUXk8Nc5qQ8"],
  weather: ["How's The Weather? | Super Simple Songs", "https://www.youtube.com/embed/rD6FRDd9Hew"]
};

const wordsByTopic: Record<string, Array<[string, string, string, string]>> = {
  hello: [
    ["hello", "xin chào", "Hello, I am Ben.", "👋"],
    ["bye", "tạm biệt", "Bye, see you!", "👋"],
    ["friend", "bạn", "This is my friend.", "🧒"],
    ["name", "tên", "My name is Anna.", "🏷️"],
    ["teacher", "giáo viên", "Hello, teacher.", "👩‍🏫"],
    ["class", "lớp học", "Welcome to class.", "🏫"]
  ],
  colors: [
    ["red", "màu đỏ", "The apple is red.", "🔴"],
    ["blue", "màu xanh dương", "The sky is blue.", "🔵"],
    ["yellow", "màu vàng", "The star is yellow.", "🟡"],
    ["green", "màu xanh lá", "The leaf is green.", "🟢"],
    ["black", "màu đen", "The cat is black.", "⚫"],
    ["white", "màu trắng", "The cloud is white.", "⚪"]
  ],
  numbers: [
    ["one", "một", "I have one pencil.", "1️⃣"],
    ["two", "hai", "I have two eyes.", "2️⃣"],
    ["three", "ba", "I see three birds.", "3️⃣"],
    ["five", "năm", "Five stars shine.", "5️⃣"],
    ["eight", "tám", "Eight fish swim.", "8️⃣"],
    ["ten", "mười", "Ten balloons fly.", "🔟"]
  ],
  "school-things": [
    ["book", "quyển sách", "This is my book.", "📘"],
    ["pen", "bút mực", "I have a pen.", "🖊️"],
    ["bag", "cặp sách", "My bag is big.", "🎒"],
    ["pencil", "bút chì", "This pencil is long.", "✏️"],
    ["ruler", "thước kẻ", "The ruler is blue.", "📏"],
    ["eraser", "cục tẩy", "I need an eraser.", "⬜"]
  ],
  family: [
    ["mother", "mẹ", "My mother is kind.", "👩"],
    ["father", "bố", "My father is tall.", "👨"],
    ["sister", "chị/em gái", "My sister can sing.", "👧"],
    ["brother", "anh/em trai", "My brother can run.", "👦"],
    ["grandma", "bà", "Grandma is happy.", "👵"],
    ["grandpa", "ông", "Grandpa is funny.", "👴"]
  ],
  animals: [
    ["cat", "con mèo", "The cat is cute.", "🐱"],
    ["dog", "con chó", "The dog can run.", "🐶"],
    ["fish", "con cá", "A fish swims.", "🐟"],
    ["bird", "con chim", "The bird can fly.", "🐦"],
    ["rabbit", "con thỏ", "The rabbit is white.", "🐰"],
    ["duck", "con vịt", "The duck is yellow.", "🦆"]
  ],
  "body-parts": [
    ["head", "cái đầu", "Touch your head.", "🙂"],
    ["hand", "bàn tay", "Wave your hand.", "✋"],
    ["eye", "mắt", "I have two eyes.", "👀"],
    ["ear", "tai", "Listen with your ears.", "👂"],
    ["nose", "mũi", "This is my nose.", "👃"],
    ["mouth", "miệng", "Open your mouth.", "👄"]
  ],
  toys: [
    ["ball", "quả bóng", "The ball is round.", "⚽"],
    ["kite", "diều", "The kite is high.", "🪁"],
    ["doll", "búp bê", "The doll is small.", "🪆"],
    ["car", "ô tô đồ chơi", "The car is fast.", "🚗"],
    ["robot", "người máy", "My robot can dance.", "🤖"],
    ["blocks", "khối xếp hình", "I build with blocks.", "🧱"]
  ],
  food: [
    ["rice", "cơm", "I like rice.", "🍚"],
    ["milk", "sữa", "Drink milk.", "🥛"],
    ["cake", "bánh", "The cake is sweet.", "🍰"],
    ["apple", "quả táo", "The apple is red.", "🍎"],
    ["banana", "quả chuối", "The banana is yellow.", "🍌"],
    ["water", "nước", "I want water.", "💧"]
  ],
  "review-1": [
    ["star", "ngôi sao", "I see a star.", "⭐"],
    ["happy", "vui vẻ", "I am happy.", "😊"],
    ["learn", "học", "We learn English.", "📖"],
    ["great", "tuyệt vời", "Great job!", "🏆"],
    ["try", "cố gắng", "Try again.", "💪"],
    ["ready", "sẵn sàng", "I am ready.", "✅"]
  ],
  greetings: [
    ["good morning", "chào buổi sáng", "Good morning, teacher.", "🌅"],
    ["good night", "chúc ngủ ngon", "Good night, Mom.", "🌙"],
    ["thank you", "cảm ơn", "Thank you very much.", "🙏"],
    ["sorry", "xin lỗi", "I am sorry.", "🙇"],
    ["please", "làm ơn", "Please help me.", "🤲"],
    ["nice to meet you", "rất vui được gặp bạn", "Nice to meet you.", "🤝"]
  ],
  "numbers-11-20": [
    ["eleven", "mười một", "I am eleven.", "11"],
    ["twelve", "mười hai", "Twelve pencils.", "12"],
    ["fifteen", "mười lăm", "Fifteen ducks swim.", "15"],
    ["sixteen", "mười sáu", "Sixteen stars.", "16"],
    ["eighteen", "mười tám", "Eighteen books.", "18"],
    ["twenty", "hai mươi", "Twenty balloons fly.", "20"]
  ],
  actions: [
    ["run", "chạy", "I can run.", "🏃"],
    ["jump", "nhảy", "Jump up high.", "🦘"],
    ["sing", "hát", "We sing a song.", "🎤"],
    ["read", "đọc", "I read a book.", "📖"],
    ["write", "viết", "Write your name.", "✍️"],
    ["draw", "vẽ", "Draw a cat.", "🎨"]
  ],
  "my-classroom": [
    ["desk", "bàn học", "This is my desk.", "🪑"],
    ["chair", "ghế", "Sit on the chair.", "💺"],
    ["board", "bảng", "Look at the board.", "⬛"],
    ["door", "cửa", "Close the door.", "🚪"],
    ["window", "cửa sổ", "Open the window.", "🪟"],
    ["clock", "đồng hồ", "Look at the clock.", "🕘"]
  ],
  "my-house": [
    ["house", "ngôi nhà", "My house is nice.", "🏠"],
    ["room", "phòng", "This is my room.", "🛏️"],
    ["door", "cửa", "Open the door.", "🚪"],
    ["kitchen", "nhà bếp", "Mom is in the kitchen.", "🍳"],
    ["bed", "giường", "This is my bed.", "🛏️"],
    ["table", "cái bàn", "The table is brown.", "🪵"]
  ],
  clothes: [
    ["shirt", "áo sơ mi", "My shirt is white.", "👕"],
    ["shoes", "giày", "My shoes are new.", "👟"],
    ["hat", "mũ", "I wear a hat.", "🧢"],
    ["dress", "váy", "The dress is red.", "👗"],
    ["socks", "tất", "My socks are blue.", "🧦"],
    ["coat", "áo khoác", "Wear a coat.", "🧥"]
  ],
  weather: [
    ["sunny", "nắng", "It is sunny.", "☀️"],
    ["rainy", "mưa", "It is rainy.", "🌧️"],
    ["windy", "có gió", "It is windy today.", "🌬️"],
    ["cloudy", "nhiều mây", "It is cloudy.", "☁️"],
    ["hot", "nóng", "It is hot.", "🔥"],
    ["cold", "lạnh", "It is cold.", "❄️"]
  ],
  likes: [
    ["like", "thích", "I like apples.", "👍"],
    ["love", "yêu thích", "I love English.", "💛"],
    ["want", "muốn", "I want water.", "🙋"],
    ["favorite", "yêu thích nhất", "My favorite color is blue.", "⭐"],
    ["fun", "vui", "English is fun.", "🎈"],
    ["great", "tuyệt", "That is great.", "🏆"]
  ],
  "simple-questions": [
    ["what", "cái gì", "What is this?", "❓"],
    ["where", "ở đâu", "Where is my book?", "📍"],
    ["who", "ai", "Who is she?", "👤"],
    ["how", "như thế nào", "How are you?", "💬"],
    ["when", "khi nào", "When is class?", "🕘"],
    ["why", "tại sao", "Why are you happy?", "🤔"]
  ],
  "review-2": [
    ["smart", "thông minh", "You are smart.", "🧠"],
    ["great", "tuyệt vời", "Great job!", "🏆"],
    ["try", "cố gắng", "Try again.", "💪"],
    ["question", "câu hỏi", "I have a question.", "❓"],
    ["answer", "câu trả lời", "This is my answer.", "✅"],
    ["practice", "luyện tập", "Practice every day.", "📚"]
  ],
  fruits: [
    ["orange", "quả cam", "The orange is sweet.", "🍊"],
    ["grape", "quả nho", "I like grapes.", "🍇"],
    ["mango", "quả xoài", "The mango is yellow.", "🥭"],
    ["pear", "quả lê", "This pear is green.", "🍐"],
    ["watermelon", "dưa hấu", "The watermelon is big.", "🍉"],
    ["strawberry", "dâu tây", "The strawberry is red.", "🍓"],
    ["pineapple", "quả dứa", "The pineapple is sweet.", "🍍"],
    ["fruit", "trái cây", "I like fruit.", "🍎"]
  ],
  drinks: [
    ["juice", "nước ép", "I want juice.", "🧃"],
    ["tea", "trà", "Mom drinks tea.", "🍵"],
    ["coffee", "cà phê", "Dad drinks coffee.", "☕"],
    ["water", "nước", "I drink water.", "💧"],
    ["milk", "sữa", "Milk is white.", "🥛"],
    ["lemonade", "nước chanh", "I like lemonade.", "🍋"],
    ["cup", "cái cốc", "This is my cup.", "🥤"],
    ["bottle", "cái chai", "The bottle is blue.", "🍼"]
  ],
  shapes: [
    ["circle", "hình tròn", "This is a circle.", "⚪"],
    ["square", "hình vuông", "This is a square.", "⬛"],
    ["triangle", "hình tam giác", "This is a triangle.", "🔺"],
    ["rectangle", "hình chữ nhật", "This is a rectangle.", "▭"],
    ["star", "ngôi sao", "I see a star.", "⭐"],
    ["heart", "trái tim", "The heart is red.", "❤️"],
    ["line", "đường thẳng", "Draw a line.", "➖"],
    ["shape", "hình dạng", "What shape is it?", "🔶"]
  ],
  feelings: [
    ["happy", "vui", "I am happy.", "😊"],
    ["sad", "buồn", "I am sad.", "🙁"],
    ["angry", "giận", "I am angry.", "😠"],
    ["sleepy", "buồn ngủ", "I am sleepy.", "😴"],
    ["hungry", "đói", "I am hungry.", "🍽️"],
    ["thirsty", "khát", "I am thirsty.", "🥤"],
    ["scared", "sợ", "I am scared.", "😟"],
    ["excited", "hào hứng", "I am excited.", "🤩"]
  ],
  playground: [
    ["slide", "cầu trượt", "I like the slide.", "🛝"],
    ["swing", "xích đu", "The swing is fun.", "🎡"],
    ["sand", "cát", "I play with sand.", "🏖️"],
    ["park", "công viên", "I go to the park.", "🌳"],
    ["run", "chạy", "I run in the park.", "🏃"],
    ["play", "chơi", "Let's play.", "🎈"],
    ["climb", "leo", "I can climb.", "🧗"],
    ["bench", "ghế dài", "Sit on the bench.", "🪑"]
  ],
  bedroom: [
    ["bed", "giường", "This is my bed.", "🛏️"],
    ["pillow", "gối", "The pillow is soft.", "🛌"],
    ["blanket", "chăn", "The blanket is warm.", "🧣"],
    ["lamp", "đèn", "Turn on the lamp.", "💡"],
    ["closet", "tủ quần áo", "Open the closet.", "🚪"],
    ["mirror", "gương", "Look in the mirror.", "🪞"],
    ["toy box", "hộp đồ chơi", "This is my toy box.", "📦"],
    ["bedroom", "phòng ngủ", "My bedroom is nice.", "🏠"]
  ],
  bathroom: [
    ["soap", "xà phòng", "Use soap.", "🧼"],
    ["towel", "khăn", "This is my towel.", "🧺"],
    ["toothbrush", "bàn chải", "I use a toothbrush.", "🪥"],
    ["toothpaste", "kem đánh răng", "Use toothpaste.", "🦷"],
    ["sink", "bồn rửa", "Wash at the sink.", "🚰"],
    ["shower", "vòi sen", "Take a shower.", "🚿"],
    ["clean", "sạch", "My hands are clean.", "✨"],
    ["wash", "rửa", "Wash your hands.", "👐"]
  ],
  transport: [
    ["car", "ô tô", "The car is fast.", "🚗"],
    ["bus", "xe buýt", "I ride the bus.", "🚌"],
    ["bike", "xe đạp", "I ride a bike.", "🚲"],
    ["train", "tàu hỏa", "The train is long.", "🚆"],
    ["plane", "máy bay", "The plane is high.", "✈️"],
    ["boat", "thuyền", "The boat is small.", "⛵"],
    ["taxi", "taxi", "This is a taxi.", "🚕"],
    ["road", "con đường", "The road is long.", "🛣️"]
  ],
  "daily-routines": [
    ["wake up", "thức dậy", "I wake up.", "⏰"],
    ["brush", "đánh răng", "I brush my teeth.", "🪥"],
    ["eat", "ăn", "I eat breakfast.", "🍽️"],
    ["go", "đi", "I go to school.", "🎒"],
    ["study", "học", "I study English.", "📚"],
    ["play", "chơi", "I play after school.", "🎈"],
    ["sleep", "ngủ", "I sleep at night.", "😴"],
    ["read", "đọc", "I read a book.", "📖"]
  ],
  manners: [
    ["please", "làm ơn", "Please help me.", "🙏"],
    ["thank you", "cảm ơn", "Thank you, teacher.", "😊"],
    ["sorry", "xin lỗi", "I am sorry.", "🙇"],
    ["excuse me", "xin phép", "Excuse me, please.", "🙋"],
    ["welcome", "không có gì", "You are welcome.", "🤝"],
    ["may I", "con có thể", "May I come in?", "🚪"],
    ["share", "chia sẻ", "I can share.", "🤲"],
    ["kind", "tử tế", "Be kind.", "💛"]
  ],
  places: [
    ["school", "trường học", "I go to school.", "🏫"],
    ["home", "nhà", "I am at home.", "🏠"],
    ["park", "công viên", "I play in the park.", "🌳"],
    ["shop", "cửa hàng", "This is a shop.", "🏪"],
    ["zoo", "sở thú", "I go to the zoo.", "🦁"],
    ["library", "thư viện", "I read in the library.", "📚"],
    ["hospital", "bệnh viện", "This is a hospital.", "🏥"],
    ["market", "chợ", "Mom goes to the market.", "🛒"]
  ],
  "community-helpers": [
    ["doctor", "bác sĩ", "The doctor helps me.", "🧑‍⚕️"],
    ["nurse", "y tá", "The nurse is kind.", "👩‍⚕️"],
    ["police officer", "cảnh sát", "The police officer helps.", "👮"],
    ["firefighter", "lính cứu hỏa", "The firefighter is brave.", "👨‍🚒"],
    ["cook", "đầu bếp", "The cook makes food.", "👨‍🍳"],
    ["driver", "tài xế", "The driver drives a bus.", "🚌"],
    ["farmer", "nông dân", "The farmer grows food.", "🧑‍🌾"],
    ["teacher", "giáo viên", "My teacher is nice.", "👩‍🏫"]
  ],
  opposites: [
    ["big", "to", "The ball is big.", "🔵"],
    ["small", "nhỏ", "The ball is small.", "⚪"],
    ["hot", "nóng", "It is hot.", "🔥"],
    ["cold", "lạnh", "It is cold.", "❄️"],
    ["fast", "nhanh", "The car is fast.", "🚗"],
    ["slow", "chậm", "The turtle is slow.", "🐢"],
    ["open", "mở", "Open the door.", "🚪"],
    ["closed", "đóng", "The door is closed.", "🔒"]
  ],
  prepositions: [
    ["in", "ở trong", "The cat is in the box.", "📦"],
    ["on", "ở trên", "The book is on the desk.", "📘"],
    ["under", "ở dưới", "The ball is under the chair.", "⚽"],
    ["next to", "bên cạnh", "I sit next to Anna.", "🧒"],
    ["behind", "phía sau", "The bag is behind me.", "🎒"],
    ["in front of", "phía trước", "Stand in front of me.", "🙋"],
    ["between", "ở giữa", "I am between two friends.", "👫"],
    ["near", "gần", "The school is near.", "🏫"]
  ],
  time: [
    ["morning", "buổi sáng", "Good morning.", "🌅"],
    ["afternoon", "buổi chiều", "Good afternoon.", "🌤️"],
    ["evening", "buổi tối", "Good evening.", "🌆"],
    ["night", "ban đêm", "Good night.", "🌙"],
    ["today", "hôm nay", "Today is fun.", "📅"],
    ["now", "bây giờ", "Study now.", "⏰"],
    ["later", "lát nữa", "See you later.", "👋"],
    ["time", "thời gian", "What time is it?", "🕘"]
  ],
  days: [
    ["Monday", "thứ Hai", "Today is Monday.", "1️⃣"],
    ["Tuesday", "thứ Ba", "Today is Tuesday.", "2️⃣"],
    ["Wednesday", "thứ Tư", "Today is Wednesday.", "3️⃣"],
    ["Thursday", "thứ Năm", "Today is Thursday.", "4️⃣"],
    ["Friday", "thứ Sáu", "Today is Friday.", "5️⃣"],
    ["Saturday", "thứ Bảy", "Today is Saturday.", "6️⃣"],
    ["Sunday", "Chủ nhật", "Today is Sunday.", "7️⃣"],
    ["week", "tuần", "This week is fun.", "📆"]
  ],
  health: [
    ["sick", "ốm", "I am sick.", "🤒"],
    ["tired", "mệt", "I am tired.", "😪"],
    ["well", "khỏe", "I am well.", "😊"],
    ["hurt", "đau", "My hand hurts.", "🤕"],
    ["medicine", "thuốc", "Take medicine.", "💊"],
    ["rest", "nghỉ ngơi", "I need rest.", "🛌"],
    ["doctor", "bác sĩ", "See a doctor.", "🧑‍⚕️"],
    ["healthy", "khỏe mạnh", "I am healthy.", "💪"]
  ],
  shopping: [
    ["buy", "mua", "I buy a book.", "🛍️"],
    ["sell", "bán", "They sell fruit.", "🏪"],
    ["money", "tiền", "I have money.", "💵"],
    ["price", "giá", "What is the price?", "🏷️"],
    ["cheap", "rẻ", "It is cheap.", "🙂"],
    ["expensive", "đắt", "It is expensive.", "💎"],
    ["basket", "giỏ", "Put it in the basket.", "🧺"],
    ["receipt", "hóa đơn", "Here is the receipt.", "🧾"]
  ],
  hobbies: [
    ["dance", "nhảy múa", "I like to dance.", "💃"],
    ["paint", "vẽ màu", "I paint a picture.", "🎨"],
    ["swim", "bơi", "I can swim.", "🏊"],
    ["cook", "nấu ăn", "I like to cook.", "🍳"],
    ["music", "âm nhạc", "I like music.", "🎵"],
    ["game", "trò chơi", "I play a game.", "🎮"],
    ["read", "đọc", "I read stories.", "📖"],
    ["sport", "thể thao", "I like sport.", "🏀"]
  ],
  "story-time": [
    ["story", "câu chuyện", "This is a story.", "📖"],
    ["once", "ngày xưa", "Once upon a time.", "✨"],
    ["little", "nhỏ bé", "A little bird sings.", "🐦"],
    ["forest", "khu rừng", "The forest is green.", "🌲"],
    ["friend", "người bạn", "A friend helps me.", "🧒"],
    ["happy", "vui", "The child is happy.", "😊"],
    ["home", "nhà", "I go home.", "🏠"],
    ["end", "kết thúc", "The end.", "🏁"]
  ]
};

const commonExtraWords: Array<[string, string, string, string]> = [
  ["please", "làm ơn", "Please help me.", "🙏"],
  ["thank you", "cảm ơn", "Thank you very much.", "😊"],
  ["good", "tốt", "Good job!", "👍"],
  ["again", "lại lần nữa", "Say it again.", "🔁"],
  ["look", "nhìn", "Look at this.", "👀"],
  ["listen", "nghe", "Listen carefully.", "👂"],
  ["say", "nói", "Say the word.", "💬"],
  ["ready", "sẵn sàng", "I am ready.", "✅"]
];

function vocabularySource(slug: string) {
  const source = wordsByTopic[slug] ?? commonExtraWords;
  const existing = new Set(source.map(([word]) => word));
  const extra = commonExtraWords.filter(([word]) => !existing.has(word));
  return [...source, ...extra].slice(0, 8);
}

function defaultPhrases(vocabulary: Array<{ word: string; meaning: string }>, title: string): PracticePhrase[] {
  const [first, second, third, fourth, fifth, sixth] = vocabulary;
  return [
    { english: "What's your name?", vietnamese: "Con tên là gì?" },
    { english: "My name is Anna.", vietnamese: "Con tên là Anna." },
    { english: "How are you?", vietnamese: "Con khỏe không?" },
    { english: "I am happy.", vietnamese: "Con vui." },
    { english: `What is this?`, vietnamese: "Đây là gì?" },
    { english: `It is ${first.word}.`, vietnamese: `Đó là ${first.meaning}.` },
    { english: `Do you like ${second.word}?`, vietnamese: `Con có thích ${second.meaning} không?` },
    { english: `Yes, I like ${second.word}.`, vietnamese: `Có, con thích ${second.meaning}.` },
    { english: `Can you say ${third.word}?`, vietnamese: `Con nói được từ ${third.word} không?` },
    { english: `Yes. ${third.word}.`, vietnamese: `Được. ${third.word}.` },
    { english: `What do you see?`, vietnamese: "Con nhìn thấy gì?" },
    { english: `I see ${fourth.word}.`, vietnamese: `Con nhìn thấy ${fourth.meaning}.` },
    { english: `What is your favorite word?`, vietnamese: "Con thích từ nào nhất?" },
    { english: `My favorite word is ${fifth.word}.`, vietnamese: `Từ con thích nhất là ${fifth.meaning}.` },
    { english: `Where is ${first.word}?`, vietnamese: `${first.meaning} ở đâu?` },
    { english: `Here it is.`, vietnamese: "Nó ở đây." },
    { english: `Is it ${fourth.word}?`, vietnamese: `Đó có phải là ${fourth.meaning} không?` },
    { english: `Yes, it is.`, vietnamese: "Đúng rồi." },
    { english: `Can I have ${second.word}, please?`, vietnamese: `Cho con ${second.meaning} được không ạ?` },
    { english: `Here you are.`, vietnamese: "Của con đây." },
    { english: `Thank you.`, vietnamese: "Con cảm ơn." },
    { english: `You're welcome.`, vietnamese: "Không có gì." },
    { english: `Let's practice ${title} together.`, vietnamese: `Cùng luyện chủ đề ${title}.` },
    { english: `Great job! Say ${sixth.word} one more time.`, vietnamese: `Giỏi lắm! Nói ${sixth.word} thêm một lần nữa.` }
  ];
}

function defaultDialogues(vocabulary: Array<{ word: string; meaning: string }>, title: string): DialogueScenario[] {
  const [first, second, third, fourth, fifth] = vocabulary;
  return [
    {
      situation: `Ở lớp học: hỏi đáp tự nhiên về ${title}`,
      lines: [
        { speaker: "Teacher", english: `Hello! What's your name?`, vietnamese: "Xin chào! Con tên là gì?" },
        { speaker: "Student", english: `My name is Anna.`, vietnamese: "Con tên là Anna." },
        { speaker: "Teacher", english: `How are you today?`, vietnamese: "Hôm nay con khỏe không?" },
        { speaker: "Student", english: `I am happy.`, vietnamese: "Con vui." },
        { speaker: "Teacher", english: `What is this?`, vietnamese: "Đây là gì?" },
        { speaker: "Student", english: `It is ${first.word}.`, vietnamese: `Đó là ${first.meaning}.` },
        { speaker: "Teacher", english: `Do you like ${second.word}?`, vietnamese: `Con có thích ${second.meaning} không?` },
        { speaker: "Student", english: `Yes, I like ${second.word}.`, vietnamese: `Có, con thích ${second.meaning}.` }
      ]
    },
    {
      situation: "Ở nhà: hỏi đáp với phụ huynh",
      lines: [
        { speaker: "Parent", english: `What did you learn today?`, vietnamese: "Hôm nay con học gì?" },
        { speaker: "Child", english: `I learned ${title}.`, vietnamese: `Con học chủ đề ${title}.` },
        { speaker: "Parent", english: `What do you see?`, vietnamese: "Con nhìn thấy gì?" },
        { speaker: "Child", english: `I see ${third.word}.`, vietnamese: `Con nhìn thấy ${third.meaning}.` },
        { speaker: "Parent", english: `What is your favorite word?`, vietnamese: "Con thích từ nào nhất?" },
        { speaker: "Child", english: `My favorite word is ${fifth.word}.`, vietnamese: `Từ con thích nhất là ${fifth.meaning}.` },
        { speaker: "Parent", english: `Can you make a sentence?`, vietnamese: "Con đặt một câu được không?" },
        { speaker: "Child", english: `This is ${fourth.word}.`, vietnamese: `Đây là ${fourth.meaning}.` }
      ]
    },
    {
      situation: "Mini role-play: bạn hỏi, bé trả lời",
      lines: [
        { speaker: "Buddy", english: `Hi! Are you ready?`, vietnamese: "Chào! Con sẵn sàng chưa?" },
        { speaker: "Child", english: `Yes, I am ready.`, vietnamese: "Rồi, con sẵn sàng." },
        { speaker: "Buddy", english: `Can you say ${second.word}?`, vietnamese: `Con nói được từ ${second.word} không?` },
        { speaker: "Child", english: `Yes. ${second.word}.`, vietnamese: `Được. ${second.word}.` },
        { speaker: "Buddy", english: `What is this?`, vietnamese: "Đây là gì?" },
        { speaker: "Child", english: `It is ${first.word}.`, vietnamese: `Đó là ${first.meaning}.` },
        { speaker: "Buddy", english: `Thank you!`, vietnamese: "Cảm ơn con!" },
        { speaker: "Child", english: `You're welcome.`, vietnamese: "Không có gì ạ." }
      ]
    }
  ];
}

function defaultRoutine(title: string): LessonRoutineStep[] {
  return [
    { title: "1. Warm-up", description: `Nghe chủ đề ${title}, nhìn hình và đoán nghĩa.` },
    { title: "2. Listen", description: "Bấm loa từng từ, nghe chậm và nhắc lại 2 lần." },
    { title: "3. Speak", description: "Luyện câu mẫu theo cụm ngắn, không cần dịch từng chữ." },
    { title: "4. Role-play", description: "Đóng vai với phụ huynh hoặc mascot rồi làm quiz." }
  ];
}

function makeLesson(topic: [string, string, string], grade: Grade, index: number): Lesson {
  const [slug, title, description] = topic;
  const vocabulary = vocabularySource(slug).map(([word, meaning, example, visual], itemIndex) => ({
    id: `${slug}-word-${itemIndex + 1}`,
    word,
    meaning,
    example,
    image: visual,
    audio: word
  }));
  const [first, second, third, fourth] = vocabulary;
  const [videoTitle, video] = videos[slug] ?? ["Kids English practice video", "https://www.youtube.com/embed/RRlaVjD7wtA"];

  return {
    id: `g${grade}-${slug}`,
    grade,
    order: index + 1,
    title,
    description,
    image: topicVisuals[slug] ?? "⭐",
    audio: title,
    video,
    videoTitle,
    vocabulary,
    phrases: defaultPhrases(vocabulary, title),
    dialogues: defaultDialogues(vocabulary, title),
    routine: defaultRoutine(title),
    quiz: [
      {
        id: `${slug}-q1`,
        type: "image",
        prompt: `Chọn nghĩa đúng cho từ "${first.word}"`,
        options: [first.meaning, second.meaning, third.meaning, fourth.meaning],
        answer: first.meaning
      },
      {
        id: `${slug}-q2`,
        type: "listen",
        prompt: `Nghe từ mẫu: ${second.word}. Bé chọn nghĩa đúng nhé!`,
        options: [first.meaning, second.meaning, third.meaning, "không biết"],
        answer: second.meaning
      },
      {
        id: `${slug}-q3`,
        type: "meaning",
        prompt: `"${third.meaning}" trong tiếng Anh là gì?`,
        options: [first.word, second.word, third.word, title.toLowerCase()],
        answer: third.word
      },
      {
        id: `${slug}-q4`,
        type: "word",
        prompt: `Câu nào dùng từ "${first.word}"?`,
        options: [first.example, second.example, third.example, fourth.example],
        answer: first.example
      },
      {
        id: `${slug}-q5`,
        type: "meaning",
        prompt: `"${fourth.word}" nghĩa là gì?`,
        options: [third.meaning, first.meaning, fourth.meaning, second.meaning],
        answer: fourth.meaning
      }
    ]
  };
}

export const lessons: Lesson[] = [
  ...gradeOne.map((topic, index) => makeLesson(topic as [string, string, string], 1, index)),
  ...gradeTwo.map((topic, index) => makeLesson(topic as [string, string, string], 2, index))
];

export function getLessonsByGrade(grade: Grade) {
  return lessons.filter((lesson) => lesson.grade === grade).sort((a, b) => a.order - b.order);
}
