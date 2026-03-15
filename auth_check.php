<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<script>
    window.CURRENT_USER_ID = <?php echo json_encode($_SESSION['user_id']); ?>;
</script>
