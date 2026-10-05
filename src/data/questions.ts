export interface Question {
  id: number;
  question: string;
  vietnameseMeaning: string;
  category: 'CPU & Bộ vi xử lý' | 'Thiết bị ngoại vi (Peripherals)' | 'Bộ nhớ & Lưu trữ (Memory)' | 'Số nhị phân & Dữ liệu (Bits/Bytes)';
  options: string[];
  correctAnswer: string;
  explanation: string;
  grammarNote?: string;
  keyVocab: string;
}

export const UNIT1_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "The CPU is a chip which acts as the ... of a computer.",
    vietnameseMeaning: "CPU là một vi mạch đóng vai trò như ... của máy tính.",
    category: "CPU & Bộ vi xử lý",
    options: ["memo", "keyboard", "brain", "hand"],
    correctAnswer: "brain",
    explanation: "CPU (Central Processing Unit) là bộ xử lý trung tâm, được ví như 'bộ não' (brain) của máy tính vì nó điều hành, tính toán và xử lý mọi chỉ lệnh.",
    grammarNote: "Cấu trúc: 'act as + N' nghĩa là 'đóng vai trò như / hoạt động như'.",
    keyVocab: "CPU = Central Processing Unit; act as = đóng vai trò là; brain = bộ não."
  },
  {
    id: 2,
    question: "Peripherals are often divided ... three categories: input, output and storage devices.",
    vietnameseMeaning: "Các thiết bị ngoại vi thường được chia ... ba nhóm: thiết bị nhập, xuất và lưu trữ.",
    category: "Thiết bị ngoại vi (Peripherals)",
    options: ["on", "in", "into", "by"],
    correctAnswer: "into",
    explanation: "Cụm động từ cố định trong tiếng Anh: 'divide into' mang nghĩa là phân chia thành các phần hoặc các thể loại nhỏ hơn.",
    grammarNote: "Divide something INTO something: chia cái gì thành các phần.",
    keyVocab: "Peripherals = thiết bị ngoại vi; categories = các danh mục/thể loại; storage = lưu trữ."
  },
  {
    id: 3,
    question: "RAM ... for random access memory.",
    vietnameseMeaning: "RAM ... cho random access memory (bộ nhớ truy xuất ngẫu nhiên).",
    category: "Bộ nhớ & Lưu trữ (Memory)",
    options: ["stands", "stands for", "comes out from", "finds"],
    correctAnswer: "stands",
    explanation: "Trong câu hỏi đã có sẵn giới từ 'for' ngay phía sau chỗ trống ('RAM ... for'). Do đó chỉ cần điền động từ 'stands' chia theo chủ ngữ số ít RAM để tạo thành cụm 'stands for' (viết tắt của).",
    grammarNote: "Chủ ngữ 'RAM' là danh từ số ít không đếm được -> động từ chia ngôi thứ 3 số ít thêm 's': 'stands for'.",
    keyVocab: "stand for = là chữ viết tắt của, đại diện cho; RAM = Random Access Memory."
  },
  {
    id: 4,
    question: "A ... is an output device which prints out text or graphics on paper.",
    vietnameseMeaning: "Một ... là một thiết bị xuất dùng để in văn bản hoặc hình ảnh đồ họa lên giấy.",
    category: "Thiết bị ngoại vi (Peripherals)",
    options: ["mouse", "keyboard", "disk drive", "printer"],
    correctAnswer: "printer",
    explanation: "Printer (máy in) là thiết bị đầu ra (output device) có chức năng in văn bản hoặc đồ họa từ máy tính lên giấy thật.",
    grammarNote: "Mệnh đề quan hệ: 'which prints out...' bổ nghĩa cho danh từ chỉ vật 'A printer'.",
    keyVocab: "Printer = máy in; output device = thiết bị xuất; print out = in ra."
  },
  {
    id: 5,
    question: "The 'heart' of the processor which performs many different operations is ...",
    vietnameseMeaning: "'Trái tim' của bộ vi xử lý thực hiện nhiều phép toán khác nhau là ...",
    category: "CPU & Bộ vi xử lý",
    options: ["Arithmetic and logic unit", "Motherboard", "Central Unit", "Memory"],
    correctAnswer: "Arithmetic and logic unit",
    explanation: "ALU (Arithmetic and Logic Unit - Đơn vị số học và logic) là thành phần cốt lõi của CPU chịu trách nhiệm thực thi các phép toán số học (+, -, *, /) và các phép toán logic (AND, OR, NOT).",
    grammarNote: "'operations' trong ngữ cảnh tin học là các thao tác tính toán hoặc phép toán.",
    keyVocab: "ALU = Arithmetic and Logic Unit; Processor = bộ vi xử lý; perform = thực thi."
  },
  {
    id: 6,
    question: "What is the abbreviation for \"binary digit\"?",
    vietnameseMeaning: "Từ viết tắt của \"binary digit\" (chữ số nhị phân) là gì?",
    category: "Số nhị phân & Dữ liệu (Bits/Bytes)",
    options: ["BID", "BD", "BIIT", "BIT"],
    correctAnswer: "BIT",
    explanation: "Thuật ngữ 'BIT' được ghép từ hai chữ cái đầu của **BI**nary và chữ cái cuối của digi**T** = BIT (đơn vị thông tin cơ bản nhất có giá trị 0 hoặc 1).",
    grammarNote: "Abbreviation /əˌbriːviˈeɪʃn/ là danh từ mang nghĩa 'từ viết tắt'.",
    keyVocab: "binary digit = chữ số nhị phân; abbreviation = từ viết tắt; bit = đơn vị bit."
  },
  {
    id: 7,
    question: "Bits are grouped into eight-digit codes that typically represent characters. Eight bits together are called a ...",
    vietnameseMeaning: "Các bit được nhóm lại thành các mã 8 chữ số đại diện cho các ký tự. Tám bit đi cùng nhau được gọi là một ...",
    category: "Số nhị phân & Dữ liệu (Bits/Bytes)",
    options: ["kilobyte", "megabyte", "gigabyte", "byte"],
    correctAnswer: "byte",
    explanation: "Một Byte bao gồm chính xác 8 bits (1 Byte = 8 bits). 1 Byte có thể biểu diễn $2^8 = 256$ trạng thái khác nhau, đủ để mã hóa 1 ký tự ASCII thông thường.",
    grammarNote: "'Eight bits together are called a byte' là câu bị động ở thì hiện tại đơn.",
    keyVocab: "Byte = byte (8 bit); character = ký tự; eight-digit code = mã 8 chữ số."
  },
  {
    id: 8,
    question: "We store data and program permanently in ...",
    vietnameseMeaning: "Chúng ta lưu trữ dữ liệu và chương trình một cách lâu dài (vĩnh viễn) trong ...",
    category: "Bộ nhớ & Lưu trữ (Memory)",
    options: ["Hard disk, floppy disk", "Hard disk, RAM", "RAM, ROM", "Floppy disk, RAM"],
    correctAnswer: "Hard disk, floppy disk",
    explanation: "Dữ liệu được lưu trữ vĩnh viễn (non-volatile) trong các thiết bị lưu trữ thứ cấp như ổ cứng (Hard disk), đĩa mềm (Floppy disk), SSD. Ngược lại, RAM là bộ nhớ khả biến (volatile), dữ liệu sẽ mất đi khi ngắt nguồn điện.",
    grammarNote: "Trạng từ 'permanently' mang nghĩa 'vĩnh viễn / lâu dài', trái nghĩa với 'temporarily' (tạm thời).",
    keyVocab: "permanently = vĩnh viễn, lâu dài; Hard disk = ổ đĩa cứng; RAM = bộ nhớ tạm thời."
  },
  {
    id: 9,
    question: "CPU consists of three main parts?",
    vietnameseMeaning: "CPU bao gồm ba bộ phận chính nào?",
    category: "CPU & Bộ vi xử lý",
    options: ["CU, ALU and ROM", "CU, ALU and ACU", "CU, ALU and Registers", "CU, ALU and Register"],
    correctAnswer: "CU, ALU and Registers",
    explanation: "Kiến trúc CPU gồm 3 thành phần chủ chốt: 1. Control Unit (CU - Khối điều khiển), 2. Arithmetic Logic Unit (ALU - Khối số học logic), và 3. Registers (Các thanh ghi lưu trữ tạm thời tốc độ cao). Chú ý danh từ ở số nhiều 'Registers'.",
    grammarNote: "Động từ 'consist of' nghĩa là 'bao gồm / cấu thành từ'.",
    keyVocab: "Control Unit (CU); Arithmetic Logic Unit (ALU); Registers (Thanh ghi)."
  },
  {
    id: 10,
    question: "Main memory is also called?",
    vietnameseMeaning: "Bộ nhớ chính còn được gọi là gì?",
    category: "Bộ nhớ & Lưu trữ (Memory)",
    options: ["External memory", "RAM memory", "Internal memory", "ROM memory"],
    correctAnswer: "Internal memory",
    explanation: "Main memory (Bộ nhớ chính) của máy tính còn có thuật ngữ tương đương là Internal memory (Bộ nhớ trong). Nó nằm trên bo mạch chủ và kết nối trực tiếp với CPU thông qua hệ thống bus.",
    grammarNote: "'also called' = 'cũng được gọi là'.",
    keyVocab: "Main memory = bộ nhớ chính; Internal memory = bộ nhớ trong; External memory = bộ nhớ ngoài."
  }
];
