import json
import sys

def verify_placeholders(file_path, messages_to_check):
    errors = []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        errors.append(f"Error parsing {file_path}: {e}")
        return errors
    except FileNotFoundError:
        errors.append(f"Error: {file_path} not found.")
        return errors

    for key, expects_param2 in messages_to_check.items():
        if key not in data:
            errors.append(f"[{file_path}] Message key '{key}' not found.")
            continue

        message_obj = data[key]
        message_str = message_obj.get("message", "")

        if "placeholders" not in message_obj:
            if "$" in message_str or (expects_param2 and "$" in message_str):
                 errors.append(f"[{file_path}] Message '{key}' is missing 'placeholders' block.")
            continue
        elif not isinstance(message_obj["placeholders"], dict):
            errors.append(f"[{file_path}] Message '{key}' has 'placeholders' that is not an object/dict.")
            continue

        placeholders = message_obj["placeholders"]

        expected_content_val_1 = ""
        expected_content_val_2 = ""

        if "$" in message_str:
            if "1" not in placeholders:
                errors.append(f"[{file_path}] Message '{key}' is missing placeholder key '1'.")
            else:
                param1 = placeholders["1"]
                if not isinstance(param1, dict):
                    errors.append(f"[{file_path}] Message '{key}' placeholder '1' is not an object/dict.")
                else:
                    if "content" not in param1:
                        errors.append(f"[{file_path}] Message '{key}' placeholder '1' is missing 'content' field.")
                    elif param1["content"] != expected_content_val_1:
                        # Construct error message without f-string for expected value part
                        errors.append(f"[{file_path}] Message '{key}' placeholder '1' has incorrect 'content'. Expected '" + expected_content_val_1 + f"', got '{param1['content']}'.")
                    if "example" not in param1:
                        errors.append(f"[{file_path}] Message '{key}' placeholder '1' is missing 'example' field.")
        elif "1" in placeholders:
             errors.append(f"[{file_path}] Message '{key}' has placeholder '1' but no $ in message string: '{message_str}'")

        if expects_param2:
            if "$" not in message_str:
                if "2" in placeholders:
                     errors.append(f"[{file_path}] Message '{key}' has placeholder '2' but no $ in message string (and expects_param2 was True): '{message_str}'")
            else: 
                if "2" not in placeholders:
                    errors.append(f"[{file_path}] Message '{key}' is missing placeholder key '2' (message has $).")
                else:
                    param2 = placeholders["2"]
                    if not isinstance(param2, dict):
                        errors.append(f"[{file_path}] Message '{key}' placeholder '2' is not an object/dict.")
                    else:
                        if "content" not in param2:
                            errors.append(f"[{file_path}] Message '{key}' placeholder '2' is missing 'content' field.")
                        elif param2["content"] != expected_content_val_2:
                            errors.append(f"[{file_path}] Message '{key}' placeholder '2' has incorrect 'content'. Expected '" + expected_content_val_2 + f"', got '{param2['content']}'.")
                        if "example" not in param2:
                            errors.append(f"[{file_path}] Message '{key}' placeholder '2' is missing 'example' field.")
        elif "2" in placeholders:
            errors.append(f"[{file_path}] Message '{key}' has placeholder '2' but it was not expected (expects_param2 is False).")

    return errors

messages_definition = {
    "moreHouses": True, 
    "banMessageIgnoringComments": False,
    "banMessageUnableToContact": False,
    "banMessageSystematicViolations": False,
    "banMessageProfanity": False,
    "banMessageHateSpeech": False,
    "banMessageVandalism": False,
    "banMessageDuplicateProfile": False,
    "userBanPeriodFromTo": True,
    "userBanPeriodIndefinitelyFrom": False
}

en_errors = verify_placeholders("/app/_locales/en/messages.json", messages_definition)
ru_errors = verify_placeholders("/app/_locales/ru/messages.json", messages_definition)

all_errors = en_errors + ru_errors

if not all_errors:
    print("Verification successful. All specified messages in both en/messages.json and ru/messages.json have the correct placeholder definitions.")
else:
    print("Verification failed. Found discrepancies:\n" + "\n".join(all_errors))

