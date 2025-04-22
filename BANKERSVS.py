def is_safe(processes, avail, max_demand, alloc):
    n = len(processes)
    m = len(avail)
    need = [[max_demand[i][j] - alloc[i][j] for j in range(m)] for i in range(n)]
    
    finish = [False] * n
    safe_seq = []
    work = avail[:]

    while len(safe_seq) < n:
        allocated = False
        for i in range(n):
            if not finish[i] and all(need[i][j] <= work[j] for j in range(m)):
                for j in range(m):
                    work[j] += alloc[i][j]
                safe_seq.append(processes[i])
                finish[i] = True
                allocated = True
                break
        if not allocated:
            break

    if len(safe_seq) == n:
        print("\nSystem is in a SAFE state.")
        print("Safe sequence:", " -> ".join(f"P{p}" for p in safe_seq))
    else:
        print("\nSystem is in an UNSAFE state! No safe sequence found.")

# -------- User Input --------
n = int(input("Enter number of processes: "))
m = int(input("Enter number of resource types: "))

print("\nEnter Allocation Matrix:")
alloc = [list(map(int, input(f"P{i}: ").strip().split())) for i in range(n)]

print("\nEnter Max Demand Matrix:")
max_demand = [list(map(int, input(f"P{i}: ").strip().split())) for i in range(n)]

avail = list(map(int, input("\nEnter Available Resources: ").strip().split()))

processes = list(range(n))

# Run Banker's Algorithm
is_safe(processes, avail, max_demand, alloc)


#Enter number of processes: 5
#Enter number of resource types: 3

#Enter Allocation Matrix:
#P0: 0 1 0
#P1: 2 0 0
#P2: 3 0 2
#P3: 2 1 1
#P4: 0 0 2

#Enter Max Demand Matrix:
#P0: 7 5 3
#P1: 3 2 2
#P2: 9 0 2
#P3: 2 2 2
#P4: 4 3 3

#Enter Available Resources: 3 3 2
#System is in a SAFE state.
#Safe sequence: P1 -> P3 -> P0 -> P2 -> P45
