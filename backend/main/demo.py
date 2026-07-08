# def is_palindrome(s):
#     return s == s[::-1]

# print(is_palindrome("radar"))  # True
# # 

# importing Counter from collections
# s = "pythonpython"
# print(Counter(s))  # {'p':2, 'y':2, ...}



# a = [1,2,2,3,3,4]
# b = list(set(a))
# print(b)  # [1,2,3,4]


# def func(*args, **kwargs):
#     print(args)
#     print(kwargs)
# print(func(1,2,3, name="Alice", age=30))
# # Output:
# # (1, 2, 3)


# def gen():
#     for i in range(3):
#         yield i
# for i in gen():
#     print(i)



# lst = [1,2,3]
# it = iter(lst)
# print(next(it))  # 1
# print(next(it))  # 2
# print(next(it))  # 3

# def reverse_words(s):
#     return " ".join(s.split()[::-1])
# print(reverse_words("Hello World from AI"))  # "AI from World Hello"


# import re
# def find_ips(file_path):
#     with open(file_path, 'r') as f:
#         return re.findall(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', f.read())


# print(find_ips('log.txt'))  # ['192.168.1.1', '10.0.0.1']


# from collections import Counter
# text = "automation"
# print(Counter(text))


# import requests

# response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
# print(response.status_code)
# print(response.json())

# l1 = [3,4,2]
# l2 = [4,6,5]


# def add_lists(l1, l2):
#     num1 = int("".join(map(str, l1[::-1])))
#     num2 = int("".join(map(str, l2[::-1])))
#     return list(map(int, str(num1 + num2)))[::-1]
# print(add_lists(l1, l2)) 


# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

# class Solution:
#     def reverseList(self, head: ListNode) -> ListNode:
#         prev = None
#         curr = head
#         while curr:
#             next_node = curr.next
#             curr.next = prev
#             prev = curr
#             curr = next_node
#         return prev

# def printList(head):
#     curr = head
#     while curr:
#         print(curr.val, end=" -> ")
#         curr = curr.next
#     print("None")

# # Create linked list
# head = ListNode(1)
# head.next = ListNode(2)
# head.next.next = ListNode(3)

# print("Original List:")
# printList(head)

# # Reverse list
# sol = Solution()
# reversed_head = sol.reverseList(head)

# print("Reversed List:")
# printList(reversed_head)


# from selenium.webdriver.support.ui import select


# driver.switch_to.alert.accept()
# select(element).select_by_visible_text("option")

# driver.switch_to.alert.accept()
# driver.screenshot("screenshot.png")


# import requests

# response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
# print(response.status_code)
# print(response.json())


# a = [1, 2, 2, 3, 4, 4]
# b = set([x for x in a if a.count(x) > 1])
# print(b)




# a = [1, 2, 3]
# b = [2, 3, 4]
# print(list(set(a) & set(b)))


# b = "pythonn"
# freq = {}

# for a in b:
#     freq[a] = freq.get(a, 0) + 1

# print(freq)


# d = {'a': 3, 'b': 1, 'c': 2}
# print(dict(sorted(d.items(), key=lambda x: x[1])))


# a = [1, 2]
# b = a

# print(a == b)  # True
# print(a is b)  # False


# def my_decorator(func):
#     def wrapper():
#         print("Function name:", func.__name__)
#         func()
#     return wrapper

# @my_decorator
# def hello():
#     print("Hello")

# hello()


import copy

# a = [[1, 2], [3, 4]]
# b = copy.copy(a)
# b[0][0] = 99

# print(a)  # change reflects


# import copy

# a = [[1, 2], [3, 4]]
# b = copy.deepcopy(a)
# b[0][0] = 99

# print(a)  # no change


# a = [1, 2, 3]
# b = a
# del a
# print(b)
# print(a)
# # object still exists because b refers to it


# a=[1, 2, 3]
# b=a[::-1]
# print(b)  # [3, 2, 1]

# def is_palindrome(s):
#     return s == s[::-1]

# print(is_palindrome("level"))

# from collections import Counter
# s="aborad"
# print(Counter(s))

# a=[1,2,2,3,4,4]
# b= list(set(a))
# print(b)

# a, b = 5, 10
# a, b = b, a
# print(a, b)
# # Output: 10 5


n = 5
a, b = 0, 1

for i in range(n):
    print(a, end=" ")
    a, b = b, a + b
