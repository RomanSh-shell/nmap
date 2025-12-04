import json
import sys

try:
    with open("/app/_locales/en/messages.json", "r", encoding="utf-8") as f:
        en_messages_content = f.read()
except FileNotFoundError:
    print("Error: /app/_locales/en/messages.json not found.", file=sys.stderr)
    sys.exit(1)

try:
    with open("/app/_locales/ru/messages.json", "r", encoding="utf-8") as f:
        ru_messages_content = f.read()
except FileNotFoundError:
    print("Error: /app/_locales/ru/messages.json not found.", file=sys.stderr)
    sys.exit(1)

messages_to_check = {
    "moreHouses": True,  # True if $ is expected, False otherwise
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

errors = []

# Verify English messages
try:
    en_data = json.loads(en_messages_content)
except json.JSONDecodeError as e:
    errors.append(f"Error parsing _locales/en/messages.json: {e}")
    en_data = None

if en_data:
    for key, expects_param2 in messages_to_check.items():
        if key not in en_data:
            errors.append(f"[EN] Message key '{key}' not found.")
            continue
        message_obj = en_data[key]
        if "message" not in message_obj:
            errors.append(f"[EN] Message '{key}' is missing 'message' field.")
            if "placeholders" not in message_obj:
                errors.append(f"[EN] Message '{key}' is missing 'placeholders' block.")
            continue

        if "placeholders" not in message_obj:
            errors.append(f"[EN] Message '{key}' is missing 'placeholders' block.")
            continue

        placeholders = message_obj["placeholders"]
        # In JSON, $ should be represented as "$"
        # When json.loads reads this, it becomes "$" in the Python string.
        expected_content_p1 = "$"
        if "param1" not in placeholders:
            errors.append(f"[EN] Message '{key}' is missing 'param1' in 'placeholders'.")
        elif "content" not in placeholders.get("param1", {}):
            errors.append(f"[EN] Message '{key}' 'param1' is missing 'content' field.")
        elif placeholders["param1"]["content"] != expected_content_p1:
            errors.append(f"[EN] Message '{key}' has incorrect 'content' for 'param1'. Expected '{expected_content_p1}', got '{placeholders['param1']['content']}'.")

        if expects_param2:
            expected_content_p2 = "$"
            if "param2" not in placeholders:
                errors.append(f"[EN] Message '{key}' is missing 'param2' in 'placeholders' (expected).")
            elif "content" not in placeholders.get("param2", {}):
                 errors.append(f"[EN] Message '{key}' 'param2' is missing 'content' field.")
            elif placeholders["param2"]["content"] != expected_content_p2:
                errors.append(f"[EN] Message '{key}' has incorrect 'content' for 'param2'. Expected '{expected_content_p2}', got '{placeholders['param2']['content']}'.")
        elif "param2" in placeholders:
             errors.append(f"[EN] Message '{key}' has 'param2' in 'placeholders' but it was not expected.")

# Verify Russian messages
try:
    ru_data = json.loads(ru_messages_content)
except json.JSONDecodeError as e:
    errors.append(f"Error parsing _locales/ru/messages.json: {e}")
    ru_data = None

if ru_data:
    for key, expects_param2 in messages_to_check.items():
        if key not in ru_data:
            errors.append(f"[RU] Message key '{key}' not found.")
            continue
        message_obj = ru_data[key]
        if "message" not in message_obj:
            errors.append(f"[RU] Message '{key}' is missing 'message' field.")
            if "placeholders" not in message_obj:
                errors.append(f"[RU] Message '{key}' is missing 'placeholders' block.")
            continue

        if "placeholders" not in message_obj:
            errors.append(f"[RU] Message '{key}' is missing 'placeholders' block.")
            continue

        placeholders = message_obj["placeholders"]
        expected_content_p1 = "$"
        if "param1" not in placeholders:
            errors.append(f"[RU] Message '{key}' is missing 'param1' in 'placeholders'.")
        elif "content" not in placeholders.get("param1", {}):
            errors.append(f"[RU] Message '{key}' 'param1' is missing 'content' field.")
        elif placeholders["param1"]["content"] != expected_content_p1:
            errors.append(f"[RU] Message '{key}' has incorrect 'content' for 'param1'. Expected '{expected_content_p1}', got '{placeholders['param1']['content']}'.")

        if expects_param2:
            expected_content_p2 = "$"
            if "param2" not in placeholders:
                errors.append(f"[RU] Message '{key}' is missing 'param2' in 'placeholders' (expected).")
            elif "content" not in placeholders.get("param2", {}):
                 errors.append(f"[RU] Message '{key}' 'param2' is missing 'content' field.")
            elif placeholders["param2"]["content"] != expected_content_p2:
                errors.append(f"[RU] Message '{key}' has incorrect 'content' for 'param2'. Expected '{expected_content_p2}', got '{placeholders['param2']['content']}'.")
        elif "param2" in placeholders:
             errors.append(f"[RU] Message '{key}' has 'param2' in 'placeholders' but it was not expected.")

if not errors:
    print("Verification successful. All specified messages in both en/messages.json and ru/messages.json have the correct placeholder definitions.")
else:
    print("Verification failed. Found discrepancies:\n" + "\n".join(errors))

