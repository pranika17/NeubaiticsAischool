numbers = []

print("Enter 10 numbers:")

for i in range(10):
    num = float(input(f"Enter number {i+1}: "))
    numbers.append(num)

total_sum = sum(numbers)
average = total_sum / 10

print("Sum =", total_sum)
print("Average =", average)
