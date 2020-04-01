import functools
import time


def repeat_every(repeats=5, every=2):
    """
    decorator evaluates function after maximum number of repeats every number of seconds
    """

    def repeat_wrapper(func):
        @functools.wraps(func)
        def func_wrapper(*args, **kwargs):
            for _ in range(repeats):
                value = func(*args, **kwargs)
                if value:
                    return value
                time.sleep(every)

        return func_wrapper

    return repeat_wrapper
